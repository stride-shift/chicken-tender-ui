import type { TenderStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: TenderStatus
  size?: 'sm' | 'md'
}

const statusColors: Record<TenderStatus, string> = {
  active: '#22c55e',
  closed: '#64748b',
  cancelled: '#ef4444',
  awarded: '#f59e0b',
}

const statusLabels: Record<TenderStatus, string> = {
  active: 'Active',
  closed: 'Closed',
  cancelled: 'Cancelled',
  awarded: 'Awarded',
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const statusColor = statusColors[status]
  const label = statusLabels[status]

  const sizeClasses = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5'

  return (
    <div
      className={`flex items-center gap-2 bg-stone-900 rounded ${sizeClasses}`}
    >
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{
          backgroundColor: statusColor,
          boxShadow: `0 0 8px ${statusColor}, 0 0 16px ${statusColor}66`,
        }}
      />
      <span
        className="font-mono font-bold text-xs uppercase"
        style={{
          color: statusColor,
          textShadow: `0 0 5px ${statusColor}`,
        }}
      >
        {label}
      </span>
    </div>
  )
}
