import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Users, FileText, CreditCard, Tag, LogOut, ExternalLink } from 'lucide-react'

const ADMIN_EMAILS = [
  'kateleeyh@gmail.com',
  'mywasiathub@gmail.com',
  'katelee78@gmail.com',
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    redirect('/')
  }

  const navItems = [
    { href: '/admin',           label: 'Overview',    icon: LayoutDashboard },
    { href: '/admin/users',     label: 'Users',       icon: Users },
    { href: '/admin/documents', label: 'Documents',   icon: FileText },
    { href: '/admin/payments',  label: 'Revenue',     icon: CreditCard },
    { href: '/admin/promos',    label: 'Promo Codes', icon: Tag },
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-52 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-800">
          <p className="text-white font-bold text-sm">WasiatHub</p>
          <p className="text-emerald-400 text-xs mt-0.5 font-medium">Admin CRM</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-slate-800 space-y-1">
          <Link href="https://wasiathub.my" target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <ExternalLink className="w-3.5 h-3.5" /> View site
          </Link>
          <Link href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <LogOut className="w-3.5 h-3.5" /> Exit admin
          </Link>
          <p className="text-slate-500 text-xs px-3 pt-1 truncate">{user.email}</p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
