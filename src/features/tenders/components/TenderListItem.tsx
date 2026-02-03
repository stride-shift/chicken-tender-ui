import type { TenderListItem as TenderListItemType } from '@/lib/types'
import { RecommendationBadge } from '@/components/shared/RecommendationBadge'

interface TenderListItemProps {
  tender: TenderListItemType
  isSelected: boolean
  onClick: () => void
}

export function TenderListItem({ tender, isSelected, onClick }: TenderListItemProps) {
  // Use generated_title if available, otherwise truncate description
  const displayTitle = tender.generated_title || truncateText(tender.description, 80)

  // Format days until close
  const daysText = formatDaysUntilClose(tender.days_until_close)
  const isUrgent = tender.days_until_close <= 3 && tender.days_until_close >= 0

  return (
    <div
      onClick={onClick}
      className={`
        p-3 cursor-pointer border-l-4 transition-all border-b border-stone-200
        ${isSelected
          ? 'bg-teal-50 border-l-teal-500'
          : 'bg-white border-l-transparent hover:bg-stone-50'
        }
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Title row */}
      <div
        className={`text-sm font-semibold leading-tight line-clamp-2 ${isSelected ? 'text-teal-700' : 'text-stone-800'}`}
      >
        {'>'} {displayTitle}
      </div>

      {/* Meta row: department, days, badge */}
      <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-500">
        {tender.department_name && (
          <span
            className="truncate max-w-[140px]"
            title={tender.department_name}
          >
            {tender.department_name}
          </span>
        )}
        {tender.department_name && <span className="text-stone-400">-</span>}
        <span
          className={`font-mono font-bold ${isUrgent ? 'text-red-600' : 'text-stone-500'}`}
        >
          {daysText}
        </span>
        <RecommendationBadge recommendation={tender.recommendation} size="sm" />
      </div>
    </div>
  )
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

function formatDaysUntilClose(days: number): string {
  if (days < 0) return 'Closed'
  if (days === 0) return 'Closes today'
  if (days === 1) return '1 day left'
  return `${days}d`
}
