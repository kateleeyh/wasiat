'use client'

import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { updateProfile, updatePassword } from '@/app/profile/actions'
import type { UserProfile } from '@/types/database'

export function ProfileForm({ profile, userId: _ }: { profile: UserProfile | null; userId: string }) {
  const t = useTranslations()

  const [profileState, profileAction, profilePending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) =>
      updateProfile(formData),
    undefined
  )

  const [pwState, pwAction, pwPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) =>
      updatePassword(formData),
    undefined
  )

  return (
    <div className="space-y-8">
      {/* Personal details */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Maklumat Peribadi / Personal Details
        </h2>
        <form action={profileAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Penuh / Full Name</label>
              <input type="text" name="fullName" defaultValue={profile?.full_name ?? ''}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Kad Pengenalan / IC Number</label>
              <input type="text" name="icNumber" defaultValue={profile?.ic_number ?? ''}
                placeholder="e.g. 800101-01-1234"
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Telefon / Phone</label>
              <input type="tel" name="phone" defaultValue={profile?.phone ?? ''}
                placeholder="e.g. 0123456789"
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tarikh Lahir / Date of Birth</label>
              <input type="date" name="dob" defaultValue={profile?.dob ?? ''}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jantina / Gender</label>
              <select name="gender" defaultValue={profile?.gender ?? ''}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-card">
                <option value="">— Pilih / Select —</option>
                <option value="male">Lelaki / Male</option>
                <option value="female">Perempuan / Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status Perkahwinan / Marital Status</label>
              <select name="maritalStatus" defaultValue={profile?.marital_status ?? ''}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-card">
                <option value="">— Pilih / Select —</option>
                <option value="single">Bujang / Single</option>
                <option value="married">Berkahwin / Married</option>
                <option value="widowed">Balu/Duda / Widowed</option>
                <option value="divorced">Bercerai / Divorced</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Alamat / Address</label>
              <textarea name="address" rows={3} defaultValue={profile?.address ?? ''}
                placeholder="No. 10, Jalan Bahagia, 50000 Kuala Lumpur"
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('common.language')}</label>
              <select name="language" defaultValue={profile?.language_preference ?? 'ms'}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-card">
                <option value="ms">Bahasa Malaysia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {profileState?.error && (
            <p className="text-sm text-destructive">{profileState.error}</p>
          )}
          {profileState?.success && (
            <p className="text-sm text-emerald-600">Profil dikemaskini. / Profile updated.</p>
          )}

          <button
            type="submit"
            disabled={profilePending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {profilePending ? t('common.loading') : t('common.save')}
          </button>
        </form>
      </section>

      <hr className="border-border" />

      {/* Change password */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Tukar Kata Laluan / Change Password
        </h2>
        <form action={pwAction} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-medium mb-1">
              Kata Laluan Baru / New Password
            </label>
            <input
              type="password"
              name="newPassword"
              required
              minLength={8}
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={8}
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          {pwState?.error && (
            <p className="text-sm text-destructive">{pwState.error}</p>
          )}
          {pwState?.success && (
            <p className="text-sm text-emerald-600">Kata laluan berjaya ditukar. / Password updated.</p>
          )}

          <button
            type="submit"
            disabled={pwPending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {pwPending ? t('common.loading') : 'Tukar / Update'}
          </button>
        </form>
      </section>
    </div>
  )
}
