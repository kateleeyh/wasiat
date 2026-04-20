'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from 'next-intl/server'
import type { DocumentType, Locale } from '@/types/database'

export async function createDocument(type: DocumentType, language?: Locale) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const resolvedLanguage: Locale = language ?? (await getLocale() as Locale)

  // Create the document record
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert({ user_id: user.id, type, language: resolvedLanguage })
    .select('id')
    .single()

  if (docError) throw docError

  // Initialise empty data row for the chosen type
  if (type === 'wasiat') {
    await supabase.from('wasiat_data').insert({ document_id: doc.id })
    redirect(`/wasiat/${doc.id}/step/1`)
  } else {
    await supabase.from('will_data').insert({ document_id: doc.id })
    redirect(`/will/${doc.id}/step/1`)
  }
}
