export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  category: string
  is_archived: boolean
  is_public: boolean
  share_id: string | null
  ai_summary: string | null
  ai_action_items: string[] | null
  ai_suggested_title: string | null
  ai_generated_at: string | null
  ai_generation_count: number
  created_at: string
  updated_at: string
}

export interface AISummaryResult {
  summary: string
  action_items: string[]
  suggested_title: string
}

export interface InsightsData {
  total_notes: number
  archived_notes: number
  public_notes: number
  recently_edited: Note[]
  most_used_tags: { tag: string; count: number }[]
  ai_usage: { total_generations: number; notes_with_ai: number }
  weekly_activity: { date: string; count: number }[]
}

export interface CreateNoteInput {
  title?: string
  content?: string
  tags?: string[]
  category?: string
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  tags?: string[]
  category?: string
  is_archived?: boolean
  is_public?: boolean
}
