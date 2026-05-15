import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRICING } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, plan } = await request.json()
  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

  const admin = createAdminClient()
  const { data: promo } = await admin
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single()

  if (!promo) return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 404 })

  // Check expiry
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 })
  }

  // Check max uses
  if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
    return NextResponse.json({ error: 'This promo code has reached its usage limit' }, { status: 400 })
  }

  const basePrice = plan === 'bundle' ? PRICING.bundle.amountSen : PRICING.single.amountSen
  const discountedPrice = Math.max(100, basePrice - promo.discount_sen) // minimum RM1

  return NextResponse.json({
    valid: true,
    code: promo.code,
    description: promo.description,
    originalSen: basePrice,
    discountSen: promo.discount_sen,
    finalSen: discountedPrice,
    finalRM: `RM ${(discountedPrice / 100).toFixed(2)}`,
    savingRM: `RM ${(promo.discount_sen / 100).toFixed(2)}`,
  })
}
