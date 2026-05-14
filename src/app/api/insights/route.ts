import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { InsightsData } from '@/types'
import { subDays, format, startOfDay } from 'date-fns'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all user notes
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const allNotes = notes || []

  // Stats
  const total_notes = allNotes.length
  const archived_notes = allNotes.filter((n) => n.is_archived).length
  const public_notes = allNotes.filter((n) => n.is_public).length

  // Recently edited (top 5, non-archived)
  const recently_edited = allNotes
    .filter((n) => !n.is_archived)
    .slice(0, 5)

  // Most used tags
  const tagMap = new Map<string, number>()
  allNotes.forEach((note) => {
    (note.tags || []).forEach((tag: string) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  const most_used_tags = Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }))

  // AI usage
  const notes_with_ai = allNotes.filter((n) => n.ai_summary).length
  const total_generations = allNotes.reduce(
    (sum, n) => sum + (n.ai_generation_count || 0),
    0
  )

  // Weekly activity (last 7 days)
  const weekly_activity = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd')
    const count = allNotes.filter((n) => {
      const noteDate = format(startOfDay(new Date(n.updated_at)), 'yyyy-MM-dd')
      return noteDate === dateStr
    }).length
    return { date: dateStr, count }
  })

  const insights: InsightsData = {
    total_notes,
    archived_notes,
    public_notes,
    recently_edited,
    most_used_tags,
    ai_usage: { total_generations, notes_with_ai },
    weekly_activity,
  }

  return NextResponse.json(insights)
}
