import type { Recommendation } from '@/lib/types'

interface RecommendationBadgeProps {
  recommendation: Recommendation
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const recommendationConfig: Record<
  Recommendation,
  { label: string; shortLabel: string; className: string }
> = {
  excellent_fit: {
    label: 'Excellent Fit',
    shortLabel: 'EX',
    className: 'bg-success/10 text-success',
  },
  good_fit: {
    label: 'Good Fit',
    shortLabel: 'GD',
    className: 'bg-info/10 text-info',
  },
  worth_reviewing: {
    label: 'Worth Reviewing',
    shortLabel: 'WR',
    className: 'bg-warning/10 text-warning',
  },
  not_recommended: {
    label: 'Not Recommended',
    shortLabel: 'NR',
    className: 'bg-muted text-muted-foreground',
  },
}

export function RecommendationBadge({
  recommendation,
  size = 'sm',
  showLabel = false,
}: RecommendationBadgeProps) {
  const config = recommendationConfig[recommendation]

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }[size]

  const displayText = showLabel ? config.label : config.shortLabel

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors ${sizeStyles} ${config.className}`}
      title={config.label}
    >
      {displayText}
    </span>
  )
}

// Helper to get recommendation display info
export function getRecommendationInfo(recommendation: Recommendation) {
  const { label, shortLabel } = recommendationConfig[recommendation]
  return { label, shortLabel }
}
