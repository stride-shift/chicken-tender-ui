import type { Importance } from '@/lib/types'

interface ImportanceBadgeProps {
  importance: Importance
  size?: 'sm' | 'md'
}

const importanceConfig: Record<Importance, { label: string }> = {
  high: { label: 'High' },
  medium: { label: 'Medium' },
  low: { label: 'Low' },
}

export function ImportanceBadge({ importance, size = 'sm' }: ImportanceBadgeProps) {
  const config = importanceConfig[importance]

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'

  // High - Red with pulse animation
  if (importance === 'high') {
    return (
      <span
        className={`inline-flex items-center font-black rounded animate-pulse ${sizeClasses}`}
        style={{
          background: 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)',
          boxShadow: '0 2px 0 #991b1b, 0 0 8px #ef444466',
          color: 'white',
        }}
      >
        {config.label}
      </span>
    )
  }

  // Medium - Amber solid
  if (importance === 'medium') {
    return (
      <span
        className={`inline-flex items-center font-black rounded ${sizeClasses}`}
        style={{
          background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)',
          boxShadow: '0 2px 0 #92400e',
          color: '#78350f',
        }}
      >
        {config.label}
      </span>
    )
  }

  // Low - Gray subtle
  return (
    <span
      className={`inline-flex items-center font-bold rounded ${sizeClasses}`}
      style={{
        background: '#e7e5e4',
        color: '#78716c',
        boxShadow: '0 2px 0 #d6d3d1',
      }}
    >
      {config.label}
    </span>
  )
}
