import { memo } from 'react'
import type { TenderListItem as TenderListItemType } from '@/lib/types'
import { RecommendationBadge } from '@/components/shared/RecommendationBadge'

interface TenderListItemProps {
  tender: TenderListItemType
  isSelected: boolean
  onClick: (id: number) => void
}

export const TenderListItem = memo(function TenderListItem({ tender, isSelected, onClick }: TenderListItemProps) {
  // Use generated_title if available, otherwise truncate description
  const displayTitle = tender.generated_title || truncateText(tender.description, 80)

  // Calculate days since published
  const daysSincePublished = calculateDaysSince(tender.date_published)

  // Format dates
  const publishedText = formatDaysSince(daysSincePublished)
  const closesText = formatDaysUntilClose(tender.days_until_close)
  const isUrgent = tender.days_until_close <= 3 && tender.days_until_close >= 0
  const isClosed = tender.days_until_close < 0

  return (
    <div
      onClick={() => onClick(tender.tender_pk)}
      className={`
        px-4 py-3 cursor-pointer transition-colors border-b border-border
        ${isSelected
          ? 'bg-primary/5 border-l-2 border-l-primary'
          : 'hover:bg-muted'
        }
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(tender.tender_pk)
        }
      }}
    >
      {/* Title row */}
      <div className="font-medium text-foreground text-sm leading-tight line-clamp-2">
        {displayTitle}
      </div>

      {/* Meta row: department, date info, badge (far right) */}
      <div className="flex items-center gap-1.5 mt-1.5 text-caption text-muted-foreground">
        {/* Department - truncated */}
        {tender.department_name && (
          <span
            className="truncate max-w-[100px]"
            title={tender.department_name}
          >
            {tender.department_name}
          </span>
        )}

        {/* Date info: published · closes */}
        <span>·</span>
        <span className="whitespace-nowrap bg-muted/70 rounded px-1.5 py-0.5" title={`Published ${daysSincePublished} days ago`}>
          {publishedText}
        </span>
        <span>·</span>
        <span
          className={`font-medium whitespace-nowrap bg-muted/70 rounded px-1.5 py-0.5 ${isClosed ? 'text-muted-foreground' : isUrgent ? 'text-destructive' : 'text-foreground'}`}
          title={isClosed ? 'Tender closed' : `Closes in ${tender.days_until_close} days`}
        >
          {closesText}
        </span>

        {/* Badge - pushed to far right */}
        <div className="ml-auto">
          <RecommendationBadge recommendation={tender.recommendation} size="sm" />
        </div>
      </div>
    </div>
  )
})

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

function calculateDaysSince(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

function formatDaysSince(days: number): string {
  if (days === 0) return 'today'
  if (days === 1) return '1d ago'
  return `${days}d ago`
}

function formatDaysUntilClose(days: number): string {
  if (days < 0) return 'Closed'
  if (days === 0) return 'today'
  if (days === 1) return '1d left'
  return `${days}d left`
}
