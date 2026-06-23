import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const HOOK_SECRET = process.env.SUPABASE_AUTH_HOOK_SECRET!
const RESEND_API_KEY = process.env.RESEND_API_KEY!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

type EmailActionType =
  | 'signup'
  | 'recovery'
  | 'invite'
  | 'magic_link'
  | 'email_change_new'
  | 'email_change_current'

interface HookPayload {
  user: {
    id: string
    email: string
    user_metadata?: { full_name?: string }
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: EmailActionType
    site_url: string
    token_new: string
    token_hash_new: string
  }
}

// Standard Webhooks verification (https://www.standardwebhooks.com)
// Secret format in env: "v1,whsec_<base64_key>"
// Signed payload: "<webhook-id>\n<webhook-timestamp>\n<body>"
// Signature header: "v1,<base64_hmac>"
function computeSig(key: Buffer | string, signedPayload: string): string {
  const hmac = createHmac('sha256', key)
  hmac.update(signedPayload)
  return hmac.digest('base64')
}

function isValidSignature(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  signatureHeader: string,
): boolean {
  try {
    const secretPart = HOOK_SECRET.replace(/^v1,whsec_/, '')
    const signedPayload = `${webhookId}.${webhookTimestamp}.${rawBody}`

    // Try decoded bytes (Standard Webhooks spec) and raw string (Supabase fallback)
    const candidates = [
      computeSig(Buffer.from(secretPart, 'base64'), signedPayload),
      computeSig(secretPart, signedPayload),
    ]

    const signatures = signatureHeader.split(' ')
    return signatures.some((sig) => {
      const sigValue = sig.replace(/^v1,/, '')
      return candidates.some((expected) => {
        try {
          const a = Buffer.from(expected, 'base64')
          const b = Buffer.from(sigValue, 'base64')
          return a.length === b.length && timingSafeEqual(a, b)
        } catch {
          return false
        }
      })
    })
  } catch {
    return false
  }
}

function verifyUrl(tokenHash: string, type: string): string {
  const params = new URLSearchParams({ token_hash: tokenHash, type })
  return `${APP_URL}/auth/confirm?${params}`
}

function buildSignupEmail(name: string, confirmUrl: string): { subject: string; html: string } {
  const subject = 'Sahkan e-mel anda untuk WasiatHub'
  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#1a3c5e;padding:24px 32px;text-align:center;">
    <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">WasiatHub</h1>
    <p style="color:#a0c4e8;margin:4px 0 0;font-size:13px;">Platform Wasiat Digital Malaysia</p>
  </div>
  <div style="padding:40px 32px;">
    <h2 style="color:#1a3c5e;margin-top:0;">Selamat datang ke WasiatHub!</h2>
    <p style="color:#444;line-height:1.6;">
      Hai ${name}, terima kasih kerana mendaftar di <strong>WasiatHub</strong> — platform wasiat digital yang selamat dan dipercayai untuk rakyat Malaysia.
    </p>
    <p style="color:#444;line-height:1.6;">
      Sila klik butang di bawah untuk mengesahkan alamat e-mel anda dan mengaktifkan akaun anda.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${confirmUrl}"
         style="background:#1a3c5e;color:#ffffff;padding:14px 32px;text-decoration:none;
                border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;">
        Sahkan E-mel Saya
      </a>
    </div>
    <p style="color:#888;font-size:13px;line-height:1.6;">
      Pautan ini akan tamat tempoh dalam masa 24 jam. Jika anda tidak mendaftar di WasiatHub, abaikan e-mel ini.
    </p>
    <p style="color:#888;font-size:13px;">
      Jika butang di atas tidak berfungsi, salin dan tampal pautan ini ke pelayar anda:<br>
      <a href="${confirmUrl}" style="color:#1a3c5e;word-break:break-all;">${confirmUrl}</a>
    </p>
  </div>
  <div style="background:#f5f7fa;padding:20px 32px;text-align:center;border-top:1px solid #e0e0e0;">
    <p style="color:#888;font-size:12px;margin:0;">
      &copy; 2026 WasiatHub &middot; <a href="${APP_URL}" style="color:#1a3c5e;">wasiathub.my</a>
    </p>
    <p style="color:#aaa;font-size:11px;margin:6px 0 0;">E-mel ini dihantar secara automatik. Sila jangan balas.</p>
  </div>
</div>`
  return { subject, html }
}

function buildRecoveryEmail(name: string, resetUrl: string): { subject: string; html: string } {
  const subject = 'Reset kata laluan WasiatHub anda'
  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#1a3c5e;padding:24px 32px;text-align:center;">
    <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">WasiatHub</h1>
    <p style="color:#a0c4e8;margin:4px 0 0;font-size:13px;">Platform Wasiat Digital Malaysia</p>
  </div>
  <div style="padding:40px 32px;">
    <h2 style="color:#1a3c5e;margin-top:0;">Reset Kata Laluan</h2>
    <p style="color:#444;line-height:1.6;">
      Hai ${name}, kami menerima permintaan untuk menetapkan semula kata laluan akaun <strong>WasiatHub</strong> anda.
    </p>
    <p style="color:#444;line-height:1.6;">
      Klik butang di bawah untuk menetapkan kata laluan baharu. Pautan ini hanya sah selama 1 jam.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}"
         style="background:#1a3c5e;color:#ffffff;padding:14px 32px;text-decoration:none;
                border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;">
        Reset Kata Laluan
      </a>
    </div>
    <p style="color:#888;font-size:13px;line-height:1.6;">
      Jika anda tidak meminta reset kata laluan, abaikan e-mel ini. Akaun anda kekal selamat.
    </p>
    <p style="color:#888;font-size:13px;">
      Jika butang di atas tidak berfungsi, salin dan tampal pautan ini ke pelayar anda:<br>
      <a href="${resetUrl}" style="color:#1a3c5e;word-break:break-all;">${resetUrl}</a>
    </p>
  </div>
  <div style="background:#f5f7fa;padding:20px 32px;text-align:center;border-top:1px solid #e0e0e0;">
    <p style="color:#888;font-size:12px;margin:0;">
      &copy; 2026 WasiatHub &middot; <a href="${APP_URL}" style="color:#1a3c5e;">wasiathub.my</a>
    </p>
    <p style="color:#aaa;font-size:11px;margin:6px 0 0;">E-mel ini dihantar secara automatik. Sila jangan balas.</p>
  </div>
</div>`
  return { subject, html }
}

async function sendViaResend(to: string, subject: string, html: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'WasiatHub <services@wasiathub.my>',
      to: [to],
      subject,
      html,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend ${res.status}: ${body}`)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text()
  const webhookId        = request.headers.get('webhook-id') ?? ''
  const webhookTimestamp = request.headers.get('webhook-timestamp') ?? ''
  const webhookSignature = request.headers.get('webhook-signature') ?? ''

  if (!isValidSignature(rawBody, webhookId, webhookTimestamp, webhookSignature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody) as HookPayload
  const { user, email_data } = payload
  const name = user.user_metadata?.full_name ?? user.email
  const { email_action_type, token_hash } = email_data

  try {
    if (email_action_type === 'signup' || email_action_type === 'invite') {
      const confirmUrl = verifyUrl(token_hash, 'signup')
      const { subject, html } = buildSignupEmail(name, confirmUrl)
      await sendViaResend(user.email, subject, html)
    } else if (email_action_type === 'recovery') {
      const resetUrl = verifyUrl(token_hash, 'recovery')
      const { subject, html } = buildRecoveryEmail(name, resetUrl)
      await sendViaResend(user.email, subject, html)
    }
    // magic_link and email_change types: fall through and return {} without error
    // Supabase will not retry on a 200 response
  } catch (err) {
    console.error('[send-email hook]', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({})
}
