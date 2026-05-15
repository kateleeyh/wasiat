import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminPayments() {
  const admin = createAdminClient()

  const { data: payments } = await admin
    .from('payments')
    .select('id, amount, plan, status, paid_at, user_id, billplz_bill_id')
    .eq('status', 'paid')
    .gt('amount', 0)
    .order('paid_at', { ascending: false })

  const userIds = [...new Set((payments ?? []).map(p => p.user_id))]
  const { data: users } = await admin.from('users').select('id, email, full_name').in('id', userIds)
  const userMap: Record<string, { email: string; full_name: string }> = {}
  for (const u of users ?? []) userMap[u.id] = u

  const totalRevenue = (payments ?? []).reduce((s, p) => s + (p.amount / 100), 0)
  const bundleCount = (payments ?? []).filter(p => p.plan === 'bundle').length
  const singleCount = (payments ?? []).filter(p => p.plan === 'single').length

  // Monthly revenue
  const monthlyRevenue: Record<string, number> = {}
  for (const p of payments ?? []) {
    if (!p.paid_at) continue
    const month = new Date(p.paid_at).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })
    monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + (p.amount / 100)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Revenue</h1>
        <p className="text-slate-400 text-sm mt-1">{payments?.length ?? 0} paid transactions</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Revenue', value: `RM ${totalRevenue.toFixed(2)}`, color: 'text-emerald-400' },
          { label: 'Transactions', value: payments?.length ?? 0, color: 'text-white' },
          { label: 'Single (RM79)', value: singleCount, color: 'text-blue-400' },
          { label: 'Bundle (RM129)', value: bundleCount, color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {Object.keys(monthlyRevenue).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold text-sm mb-3">Monthly Revenue</h2>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(monthlyRevenue).map(([month, revenue]) => (
              <div key={month} className="bg-slate-800 rounded-lg px-4 py-2">
                <p className="text-slate-400 text-xs">{month}</p>
                <p className="text-emerald-400 font-bold text-sm">RM {revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                {['User', 'Plan', 'Amount', 'Date', 'Reference'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wide text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(payments ?? []).map((p) => {
                const user = userMap[p.user_id]
                return (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{user?.full_name || '—'}</p>
                      <p className="text-slate-500 text-[10px]">{user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.plan === 'bundle' ? 'bg-purple-900 text-purple-300' : 'bg-slate-700 text-slate-300'
                      }`}>{p.plan ?? 'single'}</span>
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">RM {(p.amount / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">
                      {p.billplz_bill_id?.slice(0, 14) ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!payments || payments.length === 0) && (
            <p className="text-slate-500 text-sm text-center py-10">No payments yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
