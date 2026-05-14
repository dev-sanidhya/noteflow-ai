import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const tag = searchParams.get('tag')
  const category = searchParams.get('category')
  const archived = searchParams.get('archived')
  const sort = searchParams.get('sort') || 'updated_at'

  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order(sort === 'created_at' ? 'created_at' : 'updated_at', { ascending: false })

  if (archived === 'true') {
    query = query.eq('is_archived', true)
  } else if (archived !== 'all') {
    query = query.eq('is_archived', false)
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title = 'Untitled', content = '', tags = [], category = 'General' } = body

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      title,
      content,
      tags,
      category,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
