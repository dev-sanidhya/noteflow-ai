import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">NoteFlow AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-sm font-medium px-3 py-1.5 rounded-full mb-8 border border-violet-100">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          AI-Powered Note Taking
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Your AI-powered
          <br />
          <span className="text-violet-600">notes workspace</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Write in markdown, organize with tags, and let AI summarize your thoughts,
          extract action items, and help you stay on top of everything.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="bg-violet-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Sign in
          </Link>
        </div>
        <p className="text-slate-400 text-sm mt-4">No credit card required</p>

        {/* Hero image / mockup */}
        <div className="mt-16 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200 overflow-hidden max-w-4xl mx-auto">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-slate-400 text-xs ml-2">noteflow-ai.vercel.app/notes</span>
          </div>
          <div className="flex h-72 bg-white">
            <div className="w-56 bg-slate-900 p-4 flex flex-col gap-2 flex-shrink-0">
              <div className="text-slate-400 text-xs font-medium mb-2">NOTES</div>
              {['Project Ideas', 'Meeting Notes', 'Weekly Review', 'Reading List'].map((note) => (
                <div key={note} className="text-slate-300 text-sm px-3 py-2 rounded-lg bg-slate-800 truncate">
                  {note}
                </div>
              ))}
            </div>
            <div className="flex-1 p-6">
              <div className="h-8 bg-slate-100 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-full mt-4"></div>
                <div className="h-3 bg-slate-100 rounded w-2/3"></div>
              </div>
            </div>
            <div className="w-56 border-l border-slate-100 p-4 bg-violet-50 flex-shrink-0">
              <div className="text-violet-700 text-xs font-semibold mb-3">AI SUMMARY</div>
              <div className="space-y-2">
                <div className="h-2.5 bg-violet-200 rounded w-full"></div>
                <div className="h-2.5 bg-violet-200 rounded w-4/5"></div>
                <div className="h-2.5 bg-violet-200 rounded w-3/4"></div>
              </div>
              <div className="text-violet-700 text-xs font-semibold mt-4 mb-2">ACTION ITEMS</div>
              <div className="space-y-1.5">
                <div className="h-2.5 bg-violet-200 rounded w-full"></div>
                <div className="h-2.5 bg-violet-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-slate-500 text-center mb-14 max-w-xl mx-auto">
            NoteFlow AI combines powerful note-taking with intelligent AI features to keep you productive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                title: 'Markdown Notes',
                desc: 'Write in clean markdown with live preview. Full support for headings, lists, code blocks, and more.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: 'AI Summaries',
                desc: 'One click to get a concise summary, extracted action items, and a suggested better title for any note.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                ),
                title: 'Smart Search',
                desc: 'Find any note instantly. Search across titles, content, and tags with real-time filtering.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                ),
                title: 'Public Sharing',
                desc: 'Share any note with a unique link. Recipients can view without creating an account.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                ),
                title: 'Insights Dashboard',
                desc: 'Track your writing habits with activity charts, tag usage analytics, and productivity stats.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                ),
                title: 'Tags and Categories',
                desc: 'Organize notes with custom tags and categories. Filter your workspace instantly.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-500 mb-8 text-lg">
            Join and start organizing your thoughts with AI today.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-violet-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
          >
            Create your free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">NoteFlow AI</span>
          </div>
          <p className="text-slate-400 text-sm">Built with Next.js, Supabase, and Claude AI</p>
        </div>
      </footer>
    </div>
  )
}
