'use client'

import { useState, useEffect, useTransition } from 'react'
import { Loader2, Plus, ToggleLeft, ToggleRight, Tag } from 'lucide-react'

interface PromoCode {
  id: string
  code: string
  description: string | null
  discount_sen: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

function fmt(sen: number) { return `RM ${(sen / 100).toFixed(2)}` }

export default function AdminPromos() {
  const [promos, setPromos] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)

  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [discountRM, setDiscountRM] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const [isPending, startTransition] = useTransition()

  async function loadPromos() {
    const res = await fetch('/api/admin/promos-list')
    if (res.ok) setPromos(await res.json())
    setLoading(false)
  }

  useEffect(() => { loadPromos() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !discountRM) return
    setCreating(true); setCreateError('')
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          description: description.trim() || null,
          discountSen: Math.round(parseFloat(discountRM) * 100),
          maxUses: maxUses ? parseInt(maxUses) : null,
          expiresAt: expiresAt || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setCreateError(data.error); return }
      setPromos(prev => [data, ...prev])
      setCode(''); setDescription(''); setDiscountRM(''); setMaxUses(''); setExpiresAt('')
    } catch {
      setCreateError('Failed to create promo code')
    } finally {
      setCreating(false)
    }
  }

  async function togglePromo(id: string, currentActive: boolean) {
    const res = await fetch('/api/admin/promos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !currentActive }),
    })
    if (res.ok) {
      startTransition(() => {
        setPromos(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentActive } : p))
      })
    }
  }

  const activeCount = promos.filter(p => p.is_active).length

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
        <p className="text-slate-400 text-sm mt-1">{activeCount} active · {promos.length} total</p>
      </div>

      {/* Create form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Promo Code
        </h2>
        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Code *</label>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. LAUNCH50"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 uppercase" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Discount (RM) *</label>
              <input value={discountRM} onChange={e => setDiscountRM(e.target.value)}
                type="number" step="0.01" min="0.01" placeholder="e.g. 78.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-slate-400 text-xs mb-1 block">Description (internal note)</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Launch promo for early users"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Max uses (blank = unlimited)</label>
            <input value={maxUses} onChange={e => setMaxUses(e.target.value)}
              type="number" min="1" placeholder="e.g. 100"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Expires at (blank = never)</label>
            <input value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
              type="datetime-local"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <button type="submit" disabled={creating || !code.trim() || !discountRM}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-2">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create
            </button>
            {createError && <p className="text-red-400 text-xs">{createError}</p>}
          </div>
        </form>
      </div>

      {/* Promo codes table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                {['Code', 'Discount', 'Uses', 'Expires', 'Description', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wide text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-500"><Loader2 className="w-4 h-4 animate-spin inline" /></td></tr>
              ) : promos.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-500">No promo codes yet</td></tr>
              ) : promos.map(p => {
                const expired = p.expires_at && new Date(p.expires_at) < new Date()
                const exhausted = p.max_uses !== null && p.used_count >= p.max_uses
                return (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3 font-mono font-bold text-white flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-slate-500" />{p.code}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{fmt(p.discount_sen)} off</td>
                    <td className="px-4 py-3 text-slate-400">
                      {p.used_count}{p.max_uses !== null ? ` / ${p.max_uses}` : ''}
                      {exhausted && <span className="ml-1 text-red-400">(full)</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {p.expires_at
                        ? <span className={expired ? 'text-red-400' : ''}>
                            {new Date(p.expires_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        : <span className="text-slate-600">Never</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{p.description ?? '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePromo(p.id, p.is_active)}
                        className="flex items-center gap-1.5 text-xs transition"
                        title={p.is_active ? 'Click to disable' : 'Click to enable'}>
                        {p.is_active
                          ? <><ToggleRight className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400">Active</span></>
                          : <><ToggleLeft className="w-4 h-4 text-slate-500" /><span className="text-slate-500">Disabled</span></>}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
