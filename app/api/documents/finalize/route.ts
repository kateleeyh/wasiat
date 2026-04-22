import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId, pdfBase64, fileName, testatorName, testatorEmail, docType, language } = await request.json()
  if (!documentId || !pdfBase64) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const pdfBuffer = Buffer.from(pdfBase64, 'base64')
  const isWasiat = docType === 'wasiat'
  const storagePath = `${user.id}/${documentId}/${isWasiat ? 'wasiat' : 'will'}.pdf`

  const { error: uploadError } = await adminSupabase.storage
    .from('documents')
    .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true })

  if (uploadError) {
    console.error('Upload error:', uploadError.message)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: signedData } = await adminSupabase.storage
    .from('documents')
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365 * 10)

  const pdfUrl = signedData?.signedUrl ?? ''

  await supabase.from('documents').update({ pdf_url: pdfUrl }).eq('id', documentId)

  if (testatorEmail && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const isMalay = language === 'ms'
    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: `WasiatHub <${process.env.SMTP_USER}>`,
        to: testatorEmail,
        subject: isWasiat
          ? 'Wasiat Anda Telah Berjaya Dijana — WasiatHub'
          : isMalay
            ? 'Surat Wasiat Anda Telah Berjaya Dijana — WasiatHub'
            : 'Your Last Will Has Been Generated — WasiatHub',
        html: buildEmail(testatorName, isWasiat, isMalay),
        attachments: [{
          filename: fileName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }],
      })
    } catch (emailErr) {
      console.error('Email error:', emailErr)
    }
  }

  return NextResponse.json({ success: true, pdf_url: pdfUrl })
}

function buildEmail(name: string, isWasiat: boolean, isMalay: boolean) {
  const greeting = isWasiat ? `Assalamualaikum, ${name}` : `Dear ${name},`
  const body = isWasiat
    ? `<p>Tahniah! Wasiat anda telah berjaya dijana dan dilampirkan bersama e-mel ini.</p>
       <p><strong>Langkah seterusnya:</strong> Cetak, tandatangan di hadapan 2 saksi Muslim, dan daftar di Jabatan Agama Islam negeri anda.</p>`
    : isMalay
    ? `<p>Tahniah! Surat Wasiat anda telah berjaya dijana dan dilampirkan bersama e-mel ini.</p>
       <p><strong>Langkah seterusnya:</strong> Cetak dan tandatangan di hadapan 2 saksi (bukan penerima manfaat) secara serentak.</p>`
    : `<p>Your Last Will and Testament has been successfully generated and is attached to this email.</p>
       <p><strong>Next steps:</strong> Print and sign in front of 2 witnesses (not beneficiaries) simultaneously.</p>`

  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#14532d;padding:20px 24px;">
      <h2 style="color:#fff;margin:0;">WasiatHub</h2>
    </div>
    <div style="padding:32px 24px;">
      <h3 style="margin-top:0;">${greeting}</h3>
      ${body}
      <p style="color:#666;font-size:13px;margin-top:24px;">
        <em>WasiatHub ${isMalay ? 'tidak memberikan nasihat guaman.' : 'does not provide legal advice.'}</em>
      </p>
    </div>
    <div style="background:#f5f5f5;padding:16px 24px;font-size:12px;color:#888;text-align:center;">
      © ${new Date().getFullYear()} WasiatHub. ${isMalay ? 'Hak cipta terpelihara.' : 'All rights reserved.'}
    </div>
  </div>`
}
