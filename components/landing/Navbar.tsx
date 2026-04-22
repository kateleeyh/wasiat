'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { LanguageToggle } from './LanguageToggle'

interface NavbarProps {
  locale: string
  t: {
    features: string
    howItWorks: string
    pricing: string
    faq: string
    login: string
    register: string
  }
  appName: string
}

export function Navbar({ locale, t, appName }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: t.features, href: '#features' },
    { label: t.howItWorks, href: '#how-it-works' },
    { label: t.pricing, href: '#pricing' },
    { label: t.faq, href: '#faq' },
  ]

  function scrollTo(href: string) {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">{appName}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle locale={locale} />
            <Link
              href="/auth/login"
              className="text-sm text-white/80 hover:text-white transition-colors px-3 py-1.5"
            >
              {t.login}
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {t.register}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-left text-white/80 hover:text-white text-sm py-1"
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <LanguageToggle locale={locale} />
            <Link
              href="/auth/login"
              className="text-sm text-white/80"
              onClick={() => setOpen(false)}
            >
              {t.login}
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold bg-emerald-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setOpen(false)}
            >
              {t.register}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
