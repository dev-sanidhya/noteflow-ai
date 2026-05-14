'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Note, AISummaryResult } from '@/types'
import { CATEGORIES } from '@/lib/utils'
import TagInput from './TagInput'
import AISummaryPanel from './AISummaryPanel'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface NoteEditorProps {
  noteId: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function NoteEditor({ noteId }: NoteEditorProps) {
  const router = useRouter()
  const isNew = noteId === 'new'

  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState('General')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [loading, setLoading] = useState(true)
  const [shareModal, setShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shareLoading, setShareLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const saveTimer = useRef<NodeJS.Timeout | null>(null)
  const currentNoteId = useRef<string | null>(isNew ? null : noteId)

  // Load note
  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }
    fetch(`/api/notes/${noteId}`)
      .then((r) => r.json())
      .then((data: Note) => {
        setNote(data)
        setTitle(data.title)
        setContent(data.content)
        setTags(data.tags || [])
        setCategory(data.category || 'General')
        if (data.share_id) {
          setShareUrl(`${window.location.origin}/shared/${data.share_id}`)
        }
      })
      .catch(() => router.push('/notes'))
      .finally(() => setLoading(false))
  }, [noteId, isNew, router])

  const save = useCallback(
    async (fields: { title?: string; content?: string; tags?: string[]; category?: string }) => {
      setSaveStatus('saving')
      try {
        if (currentNoteId.current === null) {
          // Create new note
          const res = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: fields.title || 'Untitled', content: fields.content || '', tags: fields.tags || [], category: fields.category || 'General' }),
          })
          const created: Note = await res.json()
          currentNoteId.current = created.id
          setNote(created)
          // Update URL without reload
          window.history.replaceState({}, '', `/notes/${created.id}`)
        } else {
          const res = await fetch(`/api/notes/${currentNoteId.current}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fields),
          })
          const updated: Note = await res.json()
          setNote(updated)
        }
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch {
        setSaveStatus('error')
      }
    },
    []
  )

  const debouncedSave = useCallback(
    (fields: { title?: string; content?: string; tags?: string[]; category?: string }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => save(fields), 1500)
    },
    [save]
  )

  const handleTitleChange = (val: string) => {
    setTitle(val)
    debouncedSave({ title: val, content, tags, category })
  }

  const handleContentChange = (val: string) => {
    setContent(val)
    debouncedSave({ title, content: val, tags, category })
  }

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags)
    debouncedSave({ title, content, tags: newTags, category })
  }

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat)
    debouncedSave({ title, content, tags, category: newCat })
  }

  const handleShare = async () => {
    setShareLoading(true)
    try {
      const id = currentNoteId.current
      if (!id) {
        await save({ title, content, tags, category })
      }
      const res = await fetch(`/api/notes/${currentNoteId.current}/share`, { method: 'POST' })
      const data = await res.json()
      setShareUrl(data.share_url)
      setShareModal(true)
    } finally {
      setShareLoading(false)
    }
  }

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSummaryGenerated = (result: AISummaryResult) => {
    if (note) {
      setNote({
        ...note,
        ai_summary: result.summary,
        ai_action_items: result.action_items,
        ai_suggested_title: result.suggested_title,
        ai_generated_at: new Date().toISOString(),
        ai_generation_count: (note.ai_generation_count || 0) + 1,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 text-violet-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-slate-500">Loading note...</span>
        </div>
      </div>
    )
  }

  const saveIndicator =
    saveStatus === 'saving' ? (
      <span className="text-xs text-slate-400 flex items-center gap-1.5">
        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Saving...
      </span>
    ) : saveStatus === 'saved' ? (
      <span className="text-xs text-emerald-600 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Saved
      </span>
    ) : saveStatus === 'error' ? (
      <span className="text-xs text-red-500">Error saving</span>
    ) : null

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Editor panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/notes')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            {saveIndicator}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              loading={shareLoading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </Button>
          </div>
        </div>

        {/* Editor content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note title..."
            className="w-full text-2xl font-bold text-slate-900 placeholder-slate-300 border-none outline-none focus:ring-0 mb-4 bg-transparent"
          />

          {/* Meta row */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <label className="text-xs font-medium text-slate-500 flex-shrink-0">Tags</label>
              <TagInput tags={tags} onChange={handleTagsChange} />
            </div>
          </div>

          {/* Content textarea */}
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing... (supports Markdown)"
            className="w-full min-h-[60vh] text-sm text-slate-800 placeholder-slate-300 border-none outline-none focus:ring-0 resize-none font-mono leading-relaxed bg-transparent"
          />
        </div>
      </div>

      {/* AI Panel */}
      <div className="w-72 border-l border-slate-100 bg-slate-50 p-4 flex flex-col overflow-hidden flex-shrink-0">
        {note ? (
          <AISummaryPanel note={note} onSummaryGenerated={handleSummaryGenerated} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-slate-400">Save the note first to use AI features</p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <Modal open={shareModal} onClose={() => setShareModal(false)} title="Share Note">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This note is now public. Anyone with the link can view it.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none"
            />
            <Button size="sm" onClick={copyShareUrl} variant={copied ? 'secondary' : 'primary'}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
