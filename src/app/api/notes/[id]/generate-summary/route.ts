import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateNoteSummary } from '@/lib/anthropic'

type Params = { params: Promise<{ id: string }> }

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch note
  const { data: note, error: noteError } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (noteError || !note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  if (!note.content || note.content.trim().length < 10) {
    return NextResponse.json({ error: 'Note content is too short to summarize' }, { status: 400 })
  }

  // Generate AI summary
  const result = await generateNoteSummary(note.title, note.content)

  // Save result to note
  await supabase
    .from('notes')
    .update({
      ai_summary: result.summary,
      ai_action_items: result.action_items,
      ai_suggested_title: result.suggested_title,
      ai_generated_at: new Date().toISOString(),
      ai_generation_count: (note.ai_generation_count || 0) + 1,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  return NextResponse.json(result)
}
