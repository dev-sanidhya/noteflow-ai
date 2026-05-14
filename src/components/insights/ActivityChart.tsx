'use client'

interface ActivityChartProps {
  data: { date: string; count: number }[]
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Weekly Activity</h3>
      <div className="flex items-end gap-2 h-24">
        {data.map((item, i) => {
          const height = Math.max((item.count / max) * 100, item.count > 0 ? 8 : 2)
          const label = new Date(item.date).toLocaleDateString('en', { weekday: 'short' })
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.count} note{item.count !== 1 ? 's' : ''}
              </div>
              <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${height}%`,
                    background: item.count > 0 ? '#7c3aed' : '#e2e8f0',
                  }}
                />
              </div>
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
