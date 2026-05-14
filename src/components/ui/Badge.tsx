import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'purple' | 'green' | 'amber' | 'red' | 'blue'
  className?: string
  onClick?: () => void
}

const variantClasses = {
  default: 'bg-slate-100 text-slate-600',
  purple: 'bg-violet-100 text-violet-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
}

export default function Badge({ children, variant = 'default', className, onClick }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md',
        variantClasses[variant],
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
