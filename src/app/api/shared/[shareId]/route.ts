import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ shareId: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { shareId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notes')
    .select('id, title, content, tags, category, created_at, updated_at')
    .eq('share_id', shareId)
    .eq('is_public', true)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Note not found or not public' }, { status: 404 })
  }

  return NextResponse.json(data)
}
