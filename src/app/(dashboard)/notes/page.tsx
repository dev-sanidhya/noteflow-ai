'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Note } from '@/types'
import NoteCard from '@/components/notes/NoteCard'
import SearchBar from '@/components/notes/SearchBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { CATEGORIES } from '@/lib/utils'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    fetch('/api/notes')
      .then((r) => r.json())
      .then((data: Note[]) => setNotes(data))
      .finally(() => setLoading(false))
  }, [])

  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>()
    notes.forEach((n) => n.tags?.forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1)))
    return Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag]) => tag)
  }, [notes])

  const filtered = useMemo(() => {
    return notes.filter((note) => {
      if (!showArchived && note.is_archived) return false
      if (showArchived && !note.is_archived) return false
      if (activeTag && !note.tags?.includes(activeTag)) return false
      if (activeCategory && note.category !== activeCategory) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q) ||
          note.tags?.some((t) => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [notes, search, activeTag, activeCategory, showArchived])

  const handleArchive = async (id: string, archived: boolean) => {
    await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_archived: archived }),
    })
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, is_archived: archived } : n)))
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar filters */}
      <div className="w-56 border-r border-slate-100 bg-slate-50 flex flex-col overflow-y-auto flex-shrink-0 p-4 gap-5">
        <Link
          href="/notes/new"
          className="flex items-center justify-center gap-2 bg-violet-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-violet-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </Link>

        <SearchBar value={search} onChange={setSearch} />

        {/* Archive toggle */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">View</p>
          <div className="space-y-1">
            <button
              onClick={() => setShowArchived(false)}
              className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${!showArchived ? 'bg-violet-50 text-violet-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Active Notes
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${showArchived ? 'bg-violet-50 text-violet-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Category</p>
          <div className="space-y-1">
            <button
              onClick={() => setActiveCategory('')}
              className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${!activeCategory ? 'bg-violet-50 text-violet-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? '' : cat)}
                className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${activeCategory === cat ? 'bg-violet-50 text-violet-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? 'purple' : 'default'}
                  onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">
              {search || activeTag || activeCategory ? 'No notes match your filters' : 'No notes yet'}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {search || activeTag || activeCategory
                ? 'Try adjusting your filters'
                : 'Create your first note to get started'}
            </p>
            {!search && !activeTag && !activeCategory && (
              <Link
                href="/notes/new"
                className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
              >
                Create a note
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500">
                {filtered.length} note{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
