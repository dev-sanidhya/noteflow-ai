import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NoteFlow AI - Your AI-Powered Notes Workspace',
  description:
    'Write, organize, and get AI-powered insights from your notes. NoteFlow AI helps you capture ideas and turn them into action.',
  keywords: 'notes, AI, productivity, markdown, organization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  )
}
