import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateShareId } from '@/lib/utils'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if already has share_id
  const { data: note } = await supabase
    .from('notes')
    .select('share_id, is_public')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  let shareId = note.share_id

  if (!shareId) {
    // Generate new share ID
    shareId = generateShareId()
    await supabase
      .from('notes')
      .update({ share_id: shareId, is_public: true })
      .eq('id', id)
      .eq('user_id', user.id)
  } else if (!note.is_public) {
    // Re-enable sharing
    await supabase
      .from('notes')
      .update({ is_public: true })
      .eq('id', id)
      .eq('user_id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const shareUrl = `${appUrl}/shared/${shareId}`

  return NextResponse.json({ share_id: shareId, share_url: shareUrl })
}
