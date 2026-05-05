import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId } = await request.json()
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })

  // Verify ownership
  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status, pdf_url')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  // Delete PDF from storage if exists
  if (doc.pdf_url) {
    try {
      const urlParts = doc.pdf_url.split('/storage/v1/object/public/')
      if (urlParts.length > 1) {
        const [bucket, ...pathParts] = urlParts[1].split('/')
        await admin.storage.from(bucket).remove([pathParts.join('/')])
      }
    } catch (e) {
      console.error('PDF deletion error:', e)
    }
  }

  // Delete document data
  const dataTable = doc.type === 'wasiat' ? 'wasiat_data' : 'will_data'
  await admin.from(dataTable).delete().eq('document_id', documentId)
  await admin.from('payments').delete().eq('document_id', documentId)
  await admin.from('documents').delete().eq('id', documentId)

  return NextResponse.json({ success: true })
}
