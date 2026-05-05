import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { CreditCard, CheckCircle, Clock, Gift, Users } from 'lucide-react'
import { PRICING } from '@/lib/pricing'

type Plan = 'single' | 'bundle' | 'credit' | string

function planLabel(plan: Plan, docLabel: string, ms: boolean) {
  if (plan === 'bundle') return ms ? `Pakej Keluarga — ${docLabel}` : `Family Bundle — ${docLabel}`
  if (plan === 'credit') return ms ? `Kredit Bundle Digunakan — ${docLabel}` : `Bundle Credit Used — ${docLabel}`
  return docLabel
}

function planBadge(plan: Plan, ms: boolean) {
  if (plan === 'bundle') return { label: ms ? 'Pakej Keluarga' : 'Family Bundle', cls: 'bg-emerald-100 text-emerald-700' }
  if (plan === 'credit') return { label: ms ? 'Kredit Digunakan' : 'Credit Used', cls: 'bg-purple-100 text-purple-700' }
  return { label: ms ? 'Berjaya' : 'Paid', cls: 'bg-emerald-100 text-emerald-700' }
}

function PlanIcon({ plan }: { plan: Plan }) {
  if (plan === 'bundle') return <Users className="w-5 h-5 text-emerald-600" />
  if (plan === 'credit') return <Gift className="w-5 h-5 text-purple-600" />
  return <CheckCircle className="w-5 h-5 text-emerald-600" />
}

function planIconBg(plan: Plan) {
  if (plan === 'bundle') return 'bg-emerald-50'
  if (plan === 'credit') return 'bg-purple-50'
  return 'bg-emerald-50'
}

export default async function BillingPage() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: payments } = await supabase
    .from('payments')
    .select('*, documents(type)')
    .eq('user_id', user.id)
    .order('paid_at', { ascending: false })

  // Check current bundle credits
  const { data: profile } = await supabase
    .from('users')
    .select('bundle_credits')
    .eq('id', user.id)
    .single()
  const bundleCredits = (profile as { bundle_credits?: number } | null)?.bundle_credits ?? 0

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-2">{ms ? 'Sejarah Pembayaran' : 'Billing History'}</h1>

      {/* Active credits banner */}
      {bundleCredits > 0 && (
        <div className="mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
          <Gift className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-purple-800">
              {ms
                ? `${bundleCredits} Kredit Bundle Aktif`
                : `${bundleCredits} Bundle Credit${bundleCredits > 1 ? 's' : ''} Active`}
            </p>
            <p className="text-xs text-purple-600 mt-0.5">
              {ms
                ? 'Kredit ini akan digunakan secara automatik pada dokumen seterusnya.'
                : 'This credit will be applied automatically to your next document.'}
            </p>
          </div>
        </div>
      )}

      {!payments || payments.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {ms ? 'Tiada rekod pembayaran lagi.' : 'No payment records yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => {
            const docType = (p.documents as { type: string } | null)?.type ?? 'document'
            const plan: Plan = (p as { plan?: string }).plan ?? 'single'

            const docLabel = docType === 'wasiat'
              ? (ms ? 'Wasiat Islam' : 'Islamic Will')
              : (ms ? 'Surat Wasiat Am' : 'General Will')

            const title = planLabel(plan, docLabel, ms)

            const paidAt = p.paid_at
              ? new Date(p.paid_at).toLocaleDateString(ms ? 'ms-MY' : 'en-MY', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })
              : '—'

            const amountDisplay = plan === 'credit'
              ? (ms ? 'Percuma' : 'Free')
              : plan === 'bundle'
                ? PRICING.bundle.displayFull
                : `RM ${(p.amount / 100).toFixed(2)}`

            const isPending = p.status !== 'paid'
            const badge = isPending
              ? { label: ms ? 'Belum bayar' : 'Pending', cls: 'bg-amber-100 text-amber-700' }
              : planBadge(plan, ms)

            return (
              <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPending ? 'bg-amber-50' : planIconBg(plan)}`}>
                  {isPending
                    ? <Clock className="w-5 h-5 text-amber-600" />
                    : <PlanIcon plan={plan} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{paidAt}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className={`font-semibold text-sm ${plan === 'credit' ? 'text-purple-600' : ''}`}>
                    {amountDisplay}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pricing reference */}
      <div className="mt-8 bg-muted/40 border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          {ms ? 'Rujukan Harga' : 'Pricing Reference'}
        </p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="font-bold text-base">{PRICING.single.displayRM}</p>
            <p className="text-muted-foreground mt-0.5">{ms ? 'Satu Dokumen' : 'Single'}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="font-bold text-base text-emerald-700">{PRICING.bundle.displayRM}</p>
            <p className="text-emerald-600 mt-0.5">{ms ? 'Pakej Keluarga' : 'Family Bundle'}</p>
            <p className="text-emerald-500 text-[10px]">{ms ? `Jimat ${PRICING.bundle.savingRM}` : `Save ${PRICING.bundle.savingRM}`}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="font-bold text-base text-purple-600">{ms ? 'Percuma' : 'Free'}</p>
            <p className="text-purple-500 mt-0.5">{ms ? 'Guna Kredit' : 'With Credit'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
