import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { formatDate } from '@/lib/utils'

interface SharedNote {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  created_at: string
  updated_at: string
}

async function getSharedNote(shareId: string): Promise<SharedNote | null> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${appUrl}/api/shared/${shareId}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ shareId: string }>
}) {
  const { shareId } = await params
  const note = await getSharedNote(shareId)

  if (!note) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">NoteFlow AI</span>
          </Link>
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Shared note
          </span>
        </div>
      </header>

      {/* Note content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Note header */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {note.category && note.category !== 'General' && (
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  {note.category}
                </span>
              )}
              {note.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">{note.title}</h1>
            <p className="text-sm text-slate-400">
              Last updated {formatDate(note.updated_at)}
            </p>
          </div>

          {/* Note body */}
          <div className="p-8">
            <div className="prose-note">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl border border-slate-200 p-6 inline-block">
            <p className="text-sm text-slate-600 mb-4">
              Create your own AI-powered notes on NoteFlow AI
            </p>
            <Link
              href="/signup"
              className="inline-block bg-violet-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
