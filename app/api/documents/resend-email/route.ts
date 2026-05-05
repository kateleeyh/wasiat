import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function buildEmail(name: string, isWasiat: boolean, isMalay: boolean) {
  const docLabel = isWasiat
    ? (isMalay ? 'Wasiat Islam' : 'Islamic Will (Wasiat)')
    : (isMalay ? 'Surat Wasiat Am' : 'General Will')

  return isMalay
    ? `<p>Assalamualaikum / Salam sejahtera ${name},</p>
       <p>Berikut adalah pautan untuk memuat turun ${docLabel} anda yang telah dijana melalui WasiatHub.</p>
       <p>Sila simpan dokumen ini di tempat yang selamat dan tandatangani di hadapan saksi yang layak.</p>
       <br/><p>Sekian, terima kasih.<br/>WasiatHub</p>`
    : `<p>Dear ${name},</p>
       <p>Please find the download link for your ${docLabel} generated via WasiatHub.</p>
       <p>Please keep this document safely and sign it in the presence of qualified witnesses.</p>
       <br/><p>Regards,<br/>WasiatHub</p>`
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
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

  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (doc.status !== 'completed') return NextResponse.json({ error: 'Document not completed' }, { status: 400 })
  if (!doc.pdf_url) return NextResponse.json({ error: 'No PDF available' }, { status: 400 })

  // Get testator email & name
  const table = doc.type === 'wasiat' ? 'wasiat_data' : 'will_data'
  const { data: formData } = await supabase
    .from(table)
    .select('testator_info')
    .eq('document_id', documentId)
    .single()

  const testatorName  = (formData?.testator_info as { full_name?: string })?.full_name ?? user.email ?? ''
  const testatorEmail = (formData?.testator_info as { email?: string })?.email ?? user.email ?? ''

  if (!testatorEmail) return NextResponse.json({ error: 'No email on file' }, { status: 400 })

  const isWasiat = doc.type === 'wasiat'
  const isMalay  = (doc.language ?? 'ms') === 'ms'
  const docLabel = isWasiat ? (isMalay ? 'Wasiat Islam' : 'Islamic Will') : (isMalay ? 'Surat Wasiat Am' : 'General Will')
  const subject  = isMalay
    ? `WasiatHub — ${docLabel} anda`
    : `WasiatHub — Your ${docLabel}`

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'WasiatHub <services@wasiathub.my>',
      to: [testatorEmail],
      subject,
      html: buildEmail(testatorName, isWasiat, isMalay) +
        `<p><a href="${doc.pdf_url}" style="background:#16a34a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">` +
        (isMalay ? 'Muat Turun PDF' : 'Download PDF') + `</a></p>`,
    }),
  })

  if (!emailRes.ok) {
    const errBody = await emailRes.text()
    console.error('Resend error status:', emailRes.status, 'body:', errBody)
    return NextResponse.json({ error: `Resend ${emailRes.status}: ${errBody}` }, { status: 502 })
  }

  return NextResponse.json({ success: true, sentTo: testatorEmail })
}
