'use client'

interface TagCloudProps {
  tags: { tag: string; count: number }[]
}

export default function TagCloud({ tags }: TagCloudProps) {
  const max = Math.max(...tags.map((t) => t.count), 1)

  if (tags.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Tags</h3>
        <p className="text-sm text-slate-400">No tags yet. Add tags to your notes to see them here.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Tags</h3>
      <div className="space-y-2">
        {tags.slice(0, 10).map(({ tag, count }) => {
          const pct = Math.round((count / max) * 100)
          return (
            <div key={tag} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-24 truncate font-medium">{tag}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-violet-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 w-5 text-right">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
