import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import sgMail from '@sendgrid/mail'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { WasiatPdf } from '@/lib/pdf/WasiatPdf'
import { WillPdf }   from '@/lib/pdf/WillPdf'
import type { WasiatRecord, WillRecord } from '@/types/database'
import type { DocumentProps } from '@react-pdf/renderer'

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '')

function makeDocRef(type: string, id: string) {
  const prefix = type === 'wasiat' ? 'WST' : 'WLL'
  return `${prefix}-${new Date().getFullYear()}-${id.slice(0, 6).toUpperCase()}`
}

export async function POST(request: NextRequest) {
  const supabase      = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId } = await request.json()
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })

  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status, pdf_url, language')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  if (doc.status !== 'completed') return NextResponse.json({ error: 'Document not yet paid' }, { status: 403 })

  if (doc.pdf_url) {
    return NextResponse.json({ success: true, pdf_url: doc.pdf_url })
  }

  try {
    const docRef      = makeDocRef(doc.type, documentId)
    const generatedAt = new Date().toISOString()

    let pdfBuffer: Buffer
    let testatorName:  string
    let testatorEmail: string
    let storagePath:   string
    let fileName:      string

    // ── Wasiat ──────────────────────────────────────────────────────────────
    if (doc.type === 'wasiat') {
      const { data: wasiatData } = await supabase
        .from('wasiat_data')
        .select('*')
        .eq('document_id', documentId)
        .single() as { data: WasiatRecord | null }

      if (!wasiatData?.testator_info) {
        return NextResponse.json({ error: 'Incomplete wasiat data' }, { status: 400 })
      }

      pdfBuffer = await renderToBuffer(
        React.createElement(WasiatPdf, { data: wasiatData, docRef, generatedAt }) as React.ReactElement<DocumentProps>
      )

      testatorName  = wasiatData.testator_info.full_name
      testatorEmail = wasiatData.testator_info.email
      storagePath   = `${user.id}/${documentId}/wasiat.pdf`
      fileName      = `Wasiat-${testatorName.replace(/\s+/g, '-')}.pdf`

    // ── General Will ─────────────────────────────────────────────────────────
    } else if (doc.type === 'general_will') {
      const { data: willData } = await supabase
        .from('will_data')
        .select('*')
        .eq('document_id', documentId)
        .single() as { data: WillRecord | null }

      if (!willData?.testator_info) {
        return NextResponse.json({ error: 'Incomplete will data' }, { status: 400 })
      }

      pdfBuffer = await renderToBuffer(
        React.createElement(WillPdf, { data: willData, docRef, generatedAt, language: (doc.language ?? 'ms') as 'ms' | 'en' }) as React.ReactElement<DocumentProps>
      )

      testatorName  = willData.testator_info.full_name
      testatorEmail = willData.testator_info.email
      storagePath   = `${user.id}/${documentId}/will.pdf`
      fileName      = `LastWill-${testatorName.replace(/\s+/g, '-')}.pdf`

    } else {
      return NextResponse.json({ error: `Unknown document type: ${doc.type}` }, { status: 400 })
    }

    // ── Upload to Storage ────────────────────────────────────────────────────
    const { error: uploadError } = await adminSupabase.storage
      .from('documents')
      .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true })

    if (uploadError) {
      console.error('Storage upload error:', uploadError.message)
      return NextResponse.json({ error: 'Failed to store PDF' }, { status: 500 })
    }

    const { data: signedData } = await adminSupabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 60 * 60 * 24 * 365 * 10)

    const pdfUrl = signedData?.signedUrl ?? ''

    await supabase
      .from('documents')
      .update({ pdf_url: pdfUrl })
      .eq('id', documentId)

    // ── Send email ───────────────────────────────────────────────────────────
    if (testatorEmail && process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      const pdfBase64  = Buffer.from(pdfBuffer).toString('base64')
      const isWasiat   = doc.type === 'wasiat'

      await sgMail.send({
        to:      testatorEmail,
        from:    process.env.SENDGRID_FROM_EMAIL,
        subject: isWasiat
          ? `Wasiat Anda Telah Berjaya Dijana — WasiatHub`
          : `Your Last Will Has Been Generated — WasiatHub`,
        html: isWasiat
          ? buildWasiatEmail(testatorName)
          : buildWillEmail(testatorName),
        attachments: [{
          content:     pdfBase64,
          filename:    fileName,
          type:        'application/pdf',
          disposition: 'attachment',
        }],
      })
    }

    return NextResponse.json({ success: true, pdf_url: pdfUrl })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('PDF generation error:', msg)
    return NextResponse.json({ error: `PDF generation failed: ${msg}` }, { status: 500 })
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────

function emailWrapper(body: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
      <div style="background:#1a1a1a;padding:20px 24px;">
        <h2 style="color:#fff;margin:0;font-size:18px;">WasiatHub</h2>
      </div>
      <div style="padding:32px 24px;">${body}</div>
      <div style="background:#f5f5f5;padding:16px 24px;font-size:12px;color:#888;text-align:center;">
        © ${new Date().getFullYear()} WasiatHub. Hak cipta terpelihara.
      </div>
    </div>`
}

function buildWasiatEmail(name: string) {
  return emailWrapper(`
    <h3 style="margin-top:0;">Assalamualaikum, ${name}</h3>
    <p>Tahniah! Wasiat anda telah berjaya dijana dan dilampirkan bersama e-mel ini.</p>
    <div style="background:#fef9ec;border:1px solid #f0c040;border-radius:8px;padding:16px;margin:24px 0;">
      <strong>Langkah Seterusnya — Penting:</strong>
      <ol style="margin:8px 0;padding-left:20px;line-height:1.8;">
        <li>Cetak dokumen Wasiat anda</li>
        <li>Tandatangani di hadapan <strong>dua orang saksi Muslim yang baligh</strong> secara serentak</li>
        <li>Semua tiga pihak menandatangani pada blok tandatangan yang disediakan</li>
        <li>Daftarkan Wasiat di <strong>Jabatan Agama Islam negeri anda</strong> (amat disyorkan)</li>
        <li>Simpan dokumen asal di tempat selamat dan maklumkan Wasi (Pelaksana) anda</li>
      </ol>
    </div>
    <p style="color:#666;font-size:13px;">
      Jika anda memerlukan salinan baharu atau mempunyai sebarang pertanyaan,
      sila hubungi kami di support@wasiathub.com
    </p>
    <p style="color:#666;font-size:13px;">
      <em>WasiatHub tidak memberikan nasihat guaman. Sila rujuk Peguam Syarie yang bertauliah
      jika anda memerlukan panduan undang-undang.</em>
    </p>`)
}

function buildWillEmail(name: string) {
  return emailWrapper(`
    <h3 style="margin-top:0;">Dear ${name},</h3>
    <p>Your Last Will and Testament has been successfully generated and is attached to this email.</p>
    <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:16px;margin:24px 0;">
      <strong>Important Next Steps:</strong>
      <ol style="margin:8px 0;padding-left:20px;line-height:1.8;">
        <li>Print your Last Will and Testament</li>
        <li>Sign in the presence of <strong>two witnesses simultaneously</strong></li>
        <li>Both witnesses must also sign in your presence and in each other's presence</li>
        <li>Witnesses must <strong>not</strong> be beneficiaries or spouses of beneficiaries</li>
        <li>Keep the original in a safe place and inform your Executor of its location</li>
        <li>Consider lodging a copy with a solicitor or safe custody service</li>
      </ol>
    </div>
    <p style="color:#666;font-size:13px;">
      If you need a new copy or have any questions, please contact us at support@wasiathub.com
    </p>
    <p style="color:#666;font-size:13px;">
      <em>WasiatHub does not provide legal advice. Please consult a qualified lawyer
      if you require legal guidance specific to your situation.</em>
    </p>`)
}
