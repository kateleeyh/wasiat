import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ completed: false })

  const { data: doc } = await supabase
    .from('documents')
    .select('status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ completed: doc?.status === 'completed' })
}
