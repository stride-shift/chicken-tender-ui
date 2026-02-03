import type { Recommendation } from '@/lib/types'

interface RecommendationBadgeProps {
  recommendation: Recommendation
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const recommendationConfig: Record<
  Recommendation,
  { label: string; shortLabel: string; gradient: string; shadow: string; textColor: string }
> = {
  excellent_fit: {
    label: 'Excellent Fit',
    shortLabel: 'EX',
    gradient: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
    shadow: '0 2px 0 #16a34a',
    textColor: 'text-white',
  },
  good_fit: {
    label: 'Good Fit',
    shortLabel: 'GD',
    gradient: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)',
    shadow: '0 2px 0 #2563eb',
    textColor: 'text-white',
  },
  worth_reviewing: {
    label: 'Worth Reviewing',
    shortLabel: 'WR',
    gradient: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)',
    shadow: '0 2px 0 #d97706',
    textColor: 'text-amber-900',
  },
  not_recommended: {
    label: 'Not Recommended',
    shortLabel: 'NR',
    gradient: 'linear-gradient(180deg, #a8a29e 0%, #78716c 100%)',
    shadow: '0 2px 0 #57534e',
    textColor: 'text-white',
  },
}

export function RecommendationBadge({
  recommendation,
  size = 'sm',
  showLabel = false,
}: RecommendationBadgeProps) {
  const config = recommendationConfig[recommendation]

  // Simplified pill badge - consistent across all types, no clipping issues
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }[size]

  const displayText = showLabel ? config.label.toUpperCase() : config.shortLabel

  return (
    <span
      className={`inline-flex items-center justify-center font-black rounded-md whitespace-nowrap ${sizeStyles} ${config.textColor}`}
      title={config.label}
      style={{
        background: config.gradient,
        boxShadow: config.shadow,
      }}
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
