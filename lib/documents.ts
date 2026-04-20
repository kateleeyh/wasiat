import { createClient } from '@/lib/supabase/server'
import type { DocumentType, Locale, WasiatRecord, WillRecord } from '@/types/database'

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createDocument(type: DocumentType, language: Locale) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('documents')
    .insert({ user_id: user.id, type, language })
    .select('id')
    .single()

  if (error) throw error

  // Initialise empty data row
  if (type === 'wasiat') {
    await supabase.from('wasiat_data').insert({ document_id: data.id })
  } else {
    await supabase.from('will_data').insert({ document_id: data.id })
  }

  return data.id as string
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getDocument(documentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function getWasiatData(documentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('wasiat_data')
    .select('*')
    .eq('document_id', documentId)
    .single()

  if (error) throw error
  return data
}

export async function getWillData(documentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('will_data')
    .select('*')
    .eq('document_id', documentId)
    .single()

  if (error) throw error
  return data
}

export async function getUserDocuments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('documents_with_status')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Update (auto-save per step) ─────────────────────────────────────────────

export async function saveWasiatStep(
  documentId: string,
  field: string,
  value: unknown
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('wasiat_data')
    .update({ [field]: value })
    .eq('document_id', documentId)

  if (error) throw error
}

export async function saveWillStep(
  documentId: string,
  field: string,
  value: unknown
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('will_data')
    .update({ [field]: value })
    .eq('document_id', documentId)

  if (error) throw error
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteDraftDocument(documentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // RLS policy only allows delete of own draft documents
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)
    .eq('user_id', user.id)
    .eq('status', 'draft')

  if (error) throw error
}

// ─── Completion check ────────────────────────────────────────────────────────

const WASIAT_REQUIRED_FIELDS = [
  'testator_info', 'movable_assets', 'immovable_assets',
  'beneficiaries', 'executor', 'backup_executor', 'witnesses', 'declaration',
] as const

const WILL_REQUIRED_FIELDS = [
  'testator_info', 'assets', 'beneficiaries',
  'executor', 'backup_executor', 'witnesses', 'declaration',
] as const

export function getWasiatCompletionStatus(data: Partial<WasiatRecord>) {
  return WASIAT_REQUIRED_FIELDS.map((field) => ({
    field,
    complete: !!data[field as keyof WasiatRecord],
  }))
}

export function getWillCompletionStatus(data: Partial<WillRecord>) {
  return WILL_REQUIRED_FIELDS.map((field) => ({
    field,
    complete: !!data[field as keyof WillRecord],
  }))
}
