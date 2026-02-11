import type { Importance } from '@/lib/types'

interface ImportanceBadgeProps {
  importance: Importance
  size?: 'sm' | 'md'
}

const importanceConfig: Record<Importance, { label: string; className: string }> = {
  high: {
    label: 'High',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  medium: {
    label: 'Medium',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  low: {
    label: 'Low',
    className: 'bg-muted text-muted-foreground border-border',
  },
}

export function ImportanceBadge({ importance, size = 'sm' }: ImportanceBadgeProps) {
  const config = importanceConfig[importance]

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold transition-colors ${sizeClasses} ${config.className}`}
    >
      {config.label}
    </span>
  )
}
