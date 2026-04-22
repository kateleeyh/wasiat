import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId } = await request.json()
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })

  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status, language, pdf_url')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (doc.status !== 'completed') return NextResponse.json({ error: 'Not paid' }, { status: 403 })

  if (doc.type === 'wasiat') {
    const { data } = await supabase
      .from('wasiat_data')
      .select('*')
      .eq('document_id', documentId)
      .single()
    return NextResponse.json({ type: 'wasiat', language: doc.language ?? 'ms', pdf_url: doc.pdf_url, data })
  } else {
    const { data } = await supabase
      .from('will_data')
      .select('*')
      .eq('document_id', documentId)
      .single()
    return NextResponse.json({ type: 'general_will', language: doc.language ?? 'ms', pdf_url: doc.pdf_url, data })
  }
}
