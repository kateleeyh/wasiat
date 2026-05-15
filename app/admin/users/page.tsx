import { createAdminClient } from '@/lib/supabase/admin'
import { CheckCircle, XCircle } from 'lucide-react'

export default async function AdminUsers() {
  const admin = createAdminClient()

  const { data: users } = await admin
    .from('users')
    .select('id, email, full_name, created_at, pdpa_consent, marketing_consent, language_preference')
    .order('created_at', { ascending: false })

  const { data: docCounts } = await admin.from('documents').select('user_id, status')

  const countsByUser: Record<string, { total: number; paid: number }> = {}
  for (const doc of docCounts ?? []) {
    if (!countsByUser[doc.user_id]) countsByUser[doc.user_id] = { total: 0, paid: 0 }
    countsByUser[doc.user_id].total++
    if (doc.status === 'completed') countsByUser[doc.user_id].paid++
  }

  const marketingList = (users ?? []).filter(u => u.marketing_consent)

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">{users?.length ?? 0} registered · {marketingList.length} marketing opt-ins</p>
        </div>
        {/* Marketing list summary */}
        {marketingList.length > 0 && (
          <div className="bg-emerald-900/30 border border-emerald-800 rounded-xl px-4 py-2 text-right">
            <p className="text-emerald-400 font-bold text-sm">{marketingList.length} email opt-ins</p>
            <p className="text-emerald-600 text-xs">Can receive promotions</p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                {['Name', 'Email', 'Registered', 'Lang', 'PDPA', 'Marketing', 'Docs', 'Paid'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wide text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => {
                const counts = countsByUser[u.id] ?? { total: 0, paid: 0 }
                return (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3 text-white font-medium">{u.full_name || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{u.email}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-slate-400 uppercase">{u.language_preference ?? 'ms'}</td>
                    <td className="px-4 py-3">
                      {u.pdpa_consent ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-700" />}
                    </td>
                    <td className="px-4 py-3">
                      {u.marketing_consent ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-700" />}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{counts.total}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        counts.paid > 0 ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>{counts.paid}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!users || users.length === 0) && (
            <p className="text-slate-500 text-sm text-center py-10">No users yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
