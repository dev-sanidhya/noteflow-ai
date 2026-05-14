interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description?: string
  accent?: boolean
}

export default function StatsCard({ title, value, icon, description, accent }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-xl border p-5 ${accent ? 'border-violet-200 bg-violet-50' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? 'bg-violet-100' : 'bg-slate-100'}`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold ${accent ? 'text-violet-700' : 'text-slate-900'}`}>{value}</p>
      {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
    </div>
  )
}
