import type { TenderStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: TenderStatus
  size?: 'sm' | 'md'
}

const statusConfig: Record<TenderStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  closed: {
    label: 'Closed',
    className: 'bg-muted text-muted-foreground border-border',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  awarded: {
    label: 'Awarded',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status]

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5' : 'px-3 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-full border text-xs font-semibold transition-colors ${sizeClasses} ${config.className}`}
    >
      {config.label}
    </span>
  )
}
