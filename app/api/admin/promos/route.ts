import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAILS = ['kateleeyh@gmail.com', 'mywasiathub@gmail.com', 'katelee78@gmail.com']

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) return null
  return user
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, description, discountSen, maxUses, expiresAt } = await request.json()
  if (!code || !discountSen) return NextResponse.json({ error: 'code and discountSen required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin.from('promo_codes').insert({
    code: code.toUpperCase().trim(),
    description: description || null,
    discount_sen: Number(discountSen),
    max_uses: maxUses ? Number(maxUses) : null,
    expires_at: expiresAt || null,
    is_active: true,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, is_active } = await request.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('promo_codes').update({ is_active }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
