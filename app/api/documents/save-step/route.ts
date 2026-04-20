import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WASIAT_ALLOWED_FIELDS = [
  'testator_info', 'movable_assets', 'immovable_assets',
  'beneficiaries', 'executor', 'backup_executor', 'witnesses', 'declaration',
]

const WILL_ALLOWED_FIELDS = [
  'testator_info', 'assets', 'beneficiaries', 'asset_distributions', 'residual_estate_beneficiary',
  'guardianship', 'executor', 'backup_executor', 'witnesses', 'declaration',
]

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { documentId, docType, fieldKey, data, fields } = body

  if (!documentId || !docType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const allowedFields = docType === 'wasiat' ? WASIAT_ALLOWED_FIELDS : WILL_ALLOWED_FIELDS

  // Build the update payload — supports single field or multiple fields
  let updatePayload: Record<string, unknown> = {}

  if (fields && Array.isArray(fields)) {
    // Multi-field save: fields = [{ fieldKey, data }, ...]
    for (const f of fields) {
      if (!allowedFields.includes(f.fieldKey)) {
        return NextResponse.json({ error: `Invalid field: ${f.fieldKey}` }, { status: 400 })
      }
      updatePayload[f.fieldKey] = f.data
    }
  } else if (fieldKey && data !== undefined) {
    // Single-field save
    if (!allowedFields.includes(fieldKey)) {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
    }
    updatePayload[fieldKey] = data
  } else {
    return NextResponse.json({ error: 'Missing fieldKey/data or fields array' }, { status: 400 })
  }

  // Verify the document belongs to this user
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('id, status')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (docError || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  if (doc.status === 'completed') {
    return NextResponse.json({ error: 'Cannot edit a completed document' }, { status: 403 })
  }

  const table = docType === 'wasiat' ? 'wasiat_data' : 'will_data'

  const { error } = await supabase
    .from(table)
    .update(updatePayload)
    .eq('document_id', documentId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
