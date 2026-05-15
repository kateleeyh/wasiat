import { createAdminClient } from '@/lib/supabase/admin'
import { Users, FileText, CreditCard, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOverview() {
  const admin = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalDocs },
    { count: completedDocs },
    { count: draftDocs },
    { count: marketingConsent },
    { data: allPayments },
    { data: recentUsers },
    { data: recentPayments },
  ] = await Promise.all([
    admin.from('users').select('*', { count: 'exact', head: true }),
    admin.from('documents').select('*', { count: 'exact', head: true }),
    admin.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    admin.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    admin.from('users').select('*', { count: 'exact', head: true }).eq('marketing_consent', true),
    admin.from('payments').select('amount, plan').eq('status', 'paid').gt('amount', 0),
    admin.from('users').select('email, full_name, created_at').order('created_at', { ascending: false }).limit(8),
    admin.from('payments').select('amount, plan, paid_at, user_id').eq('status', 'paid').gt('amount', 0).order('paid_at', { ascending: false }).limit(8),
  ])

  const totalRevenue = (allPayments ?? []).reduce((s, p) => s + (p.amount / 100), 0)
  const conversionRate = totalUsers ? Math.round(((completedDocs ?? 0) / totalUsers) * 100) : 0

  const stats = [
    { label: 'Total Users', value: totalUsers ?? 0, sub: `${marketingConsent ?? 0} opted in to marketing`, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', href: '/admin/users' },
    { label: 'Total Documents', value: totalDocs ?? 0, sub: `${draftDocs ?? 0} drafts`, icon: FileText, color: 'text-slate-300', bg: 'bg-slate-700/50', href: '/admin/documents' },
    { label: 'Paid Documents', value: completedDocs ?? 0, sub: `${conversionRate}% conversion`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', href: '/admin/documents' },
    { label: 'Total Revenue', value: `RM ${totalRevenue.toFixed(2)}`, sub: `${(allPayments ?? []).length} transactions`, icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-400/10', href: '/admin/payments' },
  ]

  // Get user map for recent payments
  const userIds = [...new Set((recentPayments ?? []).map(p => p.user_id))]
  const { data: payUsers } = await admin.from('users').select('id, email, full_name').in('id', userIds)
  const userMap: Record<string, string> = {}
  for (const u of payUsers ?? []) userMap[u.id] = u.full_name || u.email

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">WasiatHub platform summary — real-time data</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition group">
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-300 text-xs font-medium mt-0.5">{label}</p>
            <p className="text-slate-500 text-[10px] mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Recent Payments</h2>
            <Link href="/admin/payments" className="text-xs text-emerald-400 hover:underline">View all →</Link>
          </div>
          {(recentPayments ?? []).length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No payments yet</p>
          ) : (
            <div className="space-y-2">
              {(recentPayments ?? []).map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div>
                    <p className="text-slate-300 text-xs font-medium">{userMap[p.user_id] || '—'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        p.plan === 'bundle' ? 'bg-purple-900 text-purple-300' : 'bg-slate-700 text-slate-300'
                      }`}>{p.plan ?? 'single'}</span>
                      <span className="text-slate-600 text-[10px]">
                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short' }) : '—'}
                      </span>
                    </div>
                  </div>
                  <p className="text-emerald-400 font-bold text-sm">RM {(p.amount / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent users */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Recent Registrations</h2>
            <Link href="/admin/users" className="text-xs text-emerald-400 hover:underline">View all →</Link>
          </div>
          {(recentUsers ?? []).length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No users yet</p>
          ) : (
            <div className="space-y-2">
              {(recentUsers ?? []).map((u, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div>
                    <p className="text-slate-300 text-xs font-medium">{u.full_name || '—'}</p>
                    <p className="text-slate-500 text-[10px]">{u.email}</p>
                  </div>
                  <p className="text-slate-500 text-[10px]">
                    {new Date(u.created_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
