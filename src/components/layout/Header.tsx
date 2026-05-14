'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const pageTitles: Record<string, string> = {
  '/notes': 'My Notes',
  '/insights': 'Insights',
}

export default function Header() {
  const pathname = usePathname()

  const getTitle = () => {
    if (pathname.startsWith('/notes/')) return 'Note Editor'
    return pageTitles[pathname] || 'NoteFlow AI'
  }

  return (
    <header className="h-14 border-b border-slate-100 bg-white px-6 flex items-center justify-between flex-shrink-0">
      <h1 className="text-sm font-semibold text-slate-700">{getTitle()}</h1>
      <div className="flex items-center gap-3">
        {pathname === '/notes' && (
          <Link
            href="/notes/new"
            className="bg-violet-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </Link>
        )}
      </div>
    </header>
  )
}
