'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { FileText, LayoutDashboard, User, CreditCard, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'dashboard.title', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/documents', label: 'dashboard.myDocuments', icon: FileText },
  { href: '/dashboard/create', label: 'dashboard.createNew', icon: PlusCircle },
  { href: '/profile', label: 'dashboard.profile', icon: User },
  { href: '/dashboard/billing', label: 'dashboard.billingHistory', icon: CreditCard },
]

export function DashboardNav() {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <aside className="w-56 border-r border-border bg-card flex flex-col py-4 shrink-0">
      <nav className="space-y-1 px-3">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t(label)}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
