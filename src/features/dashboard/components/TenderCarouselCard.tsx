import { useNavigate } from 'react-router-dom'
import type { TenderListItem } from '@/lib/types'

interface TenderCarouselCardProps {
  tender: TenderListItem
}

export function TenderCarouselCard({ tender }: TenderCarouselCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/tenders/${tender.tender_pk}`)
  }

  const formatDaysUntilClose = (days: number): string => {
    if (days < 0) return 'Closed'
    if (days === 0) return 'today'
    if (days === 1) return '1d left'
    return `${days}d left`
  }

  const calculateDaysSince = (dateString: string): number => {
    const date = new Date(dateString)
    const now = new Date()
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  }

  const formatDaysSince = (days: number): string => {
    if (days === 0) return 'today'
    if (days === 1) return '1d ago'
    return `${days}d ago`
  }

  const daysSincePublished = calculateDaysSince(tender.date_published)

  // Determine score color based on percentage
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-info'
    return 'text-warning'
  }

  // Determine urgency styling for closing date badge
  const getUrgencyStyle = (days: number): string => {
    if (days < 7) return 'bg-destructive text-white'
    if (days < 14) return 'bg-warning text-foreground'
    return 'bg-primary text-primary-foreground'
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left h-full flex flex-col group"
    >
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full flex flex-col card-hover">
        {/* Header bar with tender number and metadata */}
        <div className="bg-slate-800 px-3 py-2 flex items-center justify-between gap-2">
          <span className="text-white text-sm font-semibold truncate">
            {tender.tender_no}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0 text-xs">
            <span className="text-white/70">
              {formatDaysSince(daysSincePublished)}
            </span>
            <span className="text-white/40">·</span>
            <span className={`font-bold px-2 py-0.5 rounded-full ${getUrgencyStyle(tender.days_until_close)}`}>
              {formatDaysUntilClose(tender.days_until_close)}
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 relative flex-1 flex flex-col">
          {/* Title row with score badge */}
          <div className="flex items-start gap-2 mb-3">
            {/* Title */}
            <div className="text-foreground font-semibold line-clamp-2 text-sm leading-snug group-hover:text-primary transition-colors flex-1">
              {tender.generated_title || tender.tender_no}
            </div>
            {/* Score badge */}
            <div className={`px-2 py-0.5 text-xs font-bold rounded-full border-2 border-primary ${getScoreColor(tender.score_percentage)} bg-background flex-shrink-0`}>
              {tender.score_percentage}%
            </div>
          </div>

          {/* LLM Notes */}
          {tender.llm_notes && (
            <p className="text-xs text-muted-foreground line-clamp-5 leading-relaxed flex-1 border-t border-border pt-3">
              {tender.llm_notes}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
