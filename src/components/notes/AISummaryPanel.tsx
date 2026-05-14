'use client'

import { useState } from 'react'
import { Note, AISummaryResult } from '@/types'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { formatRelativeDate } from '@/lib/utils'

interface AISummaryPanelProps {
  note: Note
  onSummaryGenerated: (result: AISummaryResult) => void
}

export default function AISummaryPanel({ note, onSummaryGenerated }: AISummaryPanelProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSummary = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/notes/${note.id}/generate-summary`, {
        method: 'POST',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate summary')
      }
      const data: AISummaryResult = await res.json()
      onSummaryGenerated(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const hasSummary = Boolean(note.ai_summary)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-100 rounded-md flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-800">AI Summary</span>
        </div>
        {note.ai_generation_count > 0 && (
          <span className="text-xs text-slate-400">{note.ai_generation_count}x used</span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
          {error}
        </div>
      )}

      {hasSummary ? (
        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Summary */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Summary</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{note.ai_summary}</p>
          </div>

          {/* Suggested Title */}
          {note.ai_suggested_title && note.ai_suggested_title !== note.title && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Suggested Title</h4>
              <p className="text-sm text-violet-700 font-medium">{note.ai_suggested_title}</p>
            </div>
          )}

          {/* Action Items */}
          {note.ai_action_items && note.ai_action_items.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Action Items</h4>
              <ul className="space-y-1.5">
                {note.ai_action_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-4 h-4 rounded border-2 border-violet-300 flex-shrink-0 mt-0.5"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {note.ai_generated_at && (
            <p className="text-xs text-slate-400">
              Generated {formatRelativeDate(note.ai_generated_at)}
            </p>
          )}

          <Button
            onClick={generateSummary}
            loading={loading}
            variant="secondary"
            size="sm"
            className="w-full mt-2"
          >
            {loading ? 'Generating...' : 'Regenerate'}
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-sm text-slate-500">Analyzing your note...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                Generate an AI summary with action items and a suggested title for this note.
              </p>
              <Button onClick={generateSummary} loading={loading} size="sm" className="w-full">
                Generate AI Summary
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
