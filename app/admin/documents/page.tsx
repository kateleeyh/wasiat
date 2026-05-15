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
  const will = (documents ?? []).filter(d => d.type === 'general_will')
  const paid = (documents ?? []).filter(d => d.status === 'completed')
  const draft = (documents ?? []).filter(d => d.status === 'draft')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        <p className="text-slate-400 text-sm mt-1">{documents?.length ?? 0} total documents</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Wasiat Islam', value: wasiat.length, color: 'text-emerald-400' },
          { label: 'General Will', value: will.length, color: 'text-blue-400' },
          { label: 'Paid / Completed', value: paid.length, color: 'text-amber-400' },
          { label: 'Draft (unpaid)', value: draft.length, color: 'text-slate-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                {['User', 'Type', 'Lang', 'Status', 'Created', 'Paid At'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wide text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(documents ?? []).map((doc) => {
                const user = userMap[doc.user_id]
                return (
                  <tr key={doc.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{user?.full_name || '—'}</p>
                      <p className="text-slate-500 text-[10px]">{user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        doc.type === 'wasiat' ? 'bg-emerald-900 text-emerald-300' : 'bg-blue-900 text-blue-300'
                      }`}>{doc.type === 'wasiat' ? 'Wasiat' : 'Will'}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 uppercase">{doc.language ?? 'ms'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        doc.status === 'completed' ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-700 text-slate-400'
                      }`}>{doc.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(doc.created_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {doc.paid_at ? new Date(doc.paid_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!documents || documents.length === 0) && (
            <p className="text-slate-500 text-sm text-center py-10">No documents yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
