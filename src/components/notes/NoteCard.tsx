'use client'

import Link from 'next/link'
import { Note } from '@/types'
import { formatRelativeDate, getExcerpt } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface NoteCardProps {
  note: Note
  onArchive: (id: string, archived: boolean) => void
  onDelete: (id: string) => void
}

export default function NoteCard({ note, onArchive, onDelete }: NoteCardProps) {
  const excerpt = getExcerpt(note.content)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-violet-200 hover:shadow-md transition-all group">
      <Link href={`/notes/${note.id}`} className="block mb-3">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1.5 group-hover:text-violet-700 transition-colors line-clamp-2">
          {note.title || 'Untitled'}
        </h3>
        {excerpt && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{excerpt}</p>
        )}
      </Link>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="purple">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 4 && (
            <Badge variant="default">+{note.tags.length - 4}</Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {note.category && note.category !== 'General' && (
            <Badge variant="default">{note.category}</Badge>
          )}
          {note.ai_summary && (
            <span title="Has AI summary">
              <svg className="w-3.5 h-3.5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {note.is_public && (
            <span title="Public note">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </span>
          )}
          <span className="text-slate-400 text-xs">{formatRelativeDate(note.updated_at)}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/notes/${note.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => onArchive(note.id, !note.is_archived)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            title={note.is_archived ? 'Unarchive' : 'Archive'}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this note?')) onDelete(note.id)
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
