import { useNavigate } from 'react-router-dom'
import { PixelBox } from '@/components/ui'
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
    if (days < 0) return 'CLOSED'
    if (days === 0) return 'TODAY'
    if (days === 1) return '1 DAY'
    return `${days} DAYS`
  }

  // Determine score color based on percentage - returns gradient colors
  const getScoreGradient = (score: number): { from: string; to: string; shadow: string } => {
    if (score >= 80) return { from: '#4ade80', to: '#22c55e', shadow: '#16a34a' } // green
    if (score >= 60) return { from: '#60a5fa', to: '#3b82f6', shadow: '#2563eb' } // blue
    return { from: '#fbbf24', to: '#f59e0b', shadow: '#d97706' } // amber
  }

  // Determine urgency styling for closing date badge
  const getUrgencyStyle = (days: number): { bg: string; text: string } => {
    if (days < 7) return { bg: '#ef4444', text: '#ffffff' } // red bg, white text
    if (days < 14) return { bg: '#fbbf24', text: '#1a1a1a' } // amber bg, dark text
    return { bg: '#ffffff', text: '#2d8f8f' } // white bg, teal text
  }

  const scoreColors = getScoreGradient(tender.score_percentage)

  return (
    <button
      onClick={handleClick}
      className="w-full text-left h-full flex flex-col group"
    >
      <PixelBox color="#2d8f8f" bgColor="#ffffff" className="overflow-hidden h-full flex flex-col">
        {/* Header bar - teal accent with traffic lights, tender number, and closing date */}
        <div className="bg-teal-600 px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-teal-100 text-xs font-mono truncate">
              {tender.tender_no}
            </span>
          </div>
          <span
            className="text-xs font-mono font-bold flex-shrink-0 px-2 py-0.5 rounded"
            style={{
              color: getUrgencyStyle(tender.days_until_close).text,
              backgroundColor: getUrgencyStyle(tender.days_until_close).bg,
            }}
          >
            {formatDaysUntilClose(tender.days_until_close)}
          </span>
        </div>

        {/* Card content - light background */}
        <div className="p-4 bg-white relative flex-1 flex flex-col">
          {/* Title row with score badge */}
          <div className="flex items-start gap-2 mb-3">
            {/* Title */}
            <div
              className="text-[#1a3a4a] font-mono font-bold line-clamp-2 text-sm group-hover:text-teal-600 transition-colors flex-1"
            >
              {'>'} {tender.generated_title || tender.tender_no}
            </div>
            {/* Compact score badge */}
            <div
              className="px-2 py-1 text-xs font-mono font-black text-white rounded flex-shrink-0"
              style={{
                background: `linear-gradient(180deg, ${scoreColors.from} 0%, ${scoreColors.to} 100%)`,
                boxShadow: `0 2px 0 ${scoreColors.shadow}`,
              }}
            >
              {tender.score_percentage}%
            </div>
          </div>

          {/* LLM Notes - prioritized with more space */}
          {tender.llm_notes && (
            <p className="text-xs text-stone-600 line-clamp-5 leading-relaxed font-mono flex-1 border-t border-stone-200 pt-3">
              {tender.llm_notes}
            </p>
          )}
        </div>
      </PixelBox>
    </button>
  )
}
