import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminDocuments() {
  const admin = createAdminClient()

  const { data: documents } = await admin
    .from('documents')
    .select('id, type, status, language, created_at, paid_at, user_id')
    .order('created_at', { ascending: false })

  const userIds = [...new Set((documents ?? []).map(d => d.user_id))]
  const { data: users } = await admin.from('users').select('id, email, full_name').in('id', userIds)
  const userMap: Record<string, { email: string; full_name: string }> = {}
  for (const u of users ?? []) userMap[u.id] = u

  const wasiat = (documents ?? []).filter(d => d.type === 'wasiat')
  const will   = (documents ?? []).filter(d => d.type === 'general_will')
  const paid   = (documents ?? []).filter(d => d.status === 'completed')
  const draft  = (documents ?? []).filter(d => d.status === 'draft')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        <p className="text-slate-300 text-sm mt-1">{documents?.length ?? 0} total documents</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Wasiat Islam',     value: wasiat.length, color: 'text-emerald-400' },
          { label: 'General Will',     value: will.length,   color: 'text-blue-400' },
          { label: 'Paid / Completed', value: paid.length,   color: 'text-amber-400' },
          { label: 'Draft (unpaid)',   value: draft.length,  color: 'text-slate-300' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-300 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800">
                {['User', 'Type', 'Lang', 'Status', 'Created', 'Paid At'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-slate-300 font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(documents ?? []).map((doc) => {
                const user = userMap[doc.user_id]
                return (
                  <tr key={doc.id} className="border-b border-slate-800 hover:bg-slate-800/60 transition">
                    <td className="px-5 py-3.5">
                      <p className="text-white text-sm font-medium">{user?.full_name || '—'}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{user?.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        doc.type === 'wasiat' ? 'bg-emerald-900 text-emerald-300' : 'bg-blue-900 text-blue-300'
                      }`}>{doc.type === 'wasiat' ? 'Wasiat' : 'Will'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 text-sm uppercase">{doc.language ?? 'ms'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        doc.status === 'completed' ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-700 text-slate-300'
                      }`}>{doc.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 text-sm">
                      {new Date(doc.created_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 text-sm">
                      {doc.paid_at ? new Date(doc.paid_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!documents || documents.length === 0) && (
            <p className="text-slate-400 text-sm text-center py-10">No documents yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
