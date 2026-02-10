import type { TenderDetail } from '@/lib/types'
import { RecommendationBadge } from '@/components/shared'
import { DateDisplay } from '@/components/shared'
import { HealthBar } from '@/components/ui'
import { useToast } from '@/hooks/useToast'

interface TenderDetailHeaderProps {
  tender: TenderDetail
}

export function TenderDetailHeader({ tender }: TenderDetailHeaderProps) {
  const { addToast } = useToast()

  const handleLifecycleAction = () => {
    addToast('Coming soon — Tender lifecycle management is on the way!', 'info')
  }

  // Determine title: prefer generated_title, fall back to tender_no
  const title = tender.generated_title || tender.tender_no

  // Days until close color
  const getDaysUntilColor = () => {
    if (tender.days_until_close <= 0) return '#78716c' // stone-500
    if (tender.days_until_close <= 3) return '#ef4444' // red-500
    if (tender.days_until_close <= 7) return '#f59e0b' // amber-500
    return '#22c55e' // green-500
  }

  // Check if briefing is upcoming and urgent
  const hasBriefing = tender.has_briefing_session && tender.briefing_datetime
  const isBriefingUrgent = () => {
    if (!tender.briefing_datetime) return false
    const briefingDate = new Date(tender.briefing_datetime)
    const now = new Date()
    const diffDays = Math.ceil((briefingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  }

  // Score color based on value
  const getScoreColor = (score: number | null): string => {
    if (score === null) return '#78716c'
    if (score >= 80) return '#22c55e' // green-500
    if (score >= 60) return '#3b82f6' // blue-500
    if (score >= 40) return '#f59e0b' // amber-500
    return '#78716c' // stone-500
  }

  const scoreColor = getScoreColor(tender.score_percentage)
  const scoreValue = tender.score_percentage !== null ? Math.round(tender.score_percentage) : 0

  // Build briefing display
  const getBriefingDisplay = () => {
    if (!hasBriefing) return 'None'
    const urgent = isBriefingUrgent()
    return (
      <span style={{ color: urgent ? '#d97706' : '#78716c' }}>
        <DateDisplay date={tender.briefing_datetime!} showRelative />
        {tender.is_briefing_compulsory && <span className="text-red-600 ml-0.5">!</span>}
      </span>
    )
  }

  return (
    <div className="p-4 bg-white border-b border-stone-200">
      {/* Row 1: Title + Recommendation Badge */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-black text-[#1a3a4a] font-mono truncate flex-1">
          {title}
        </h1>
        {tender.recommendation && (
          <RecommendationBadge
            recommendation={tender.recommendation}
            size="sm"
            showLabel
          />
        )}
      </div>

      {/* Row 2: Compact meta line with bullet separators */}
      <div className="mt-1.5 flex items-center flex-wrap gap-x-1 text-sm font-mono">
        {/* Tender number (if we have a generated title) */}
        {tender.generated_title && (
          <>
            <span className="text-stone-500">{tender.tender_no}</span>
            <span className="text-stone-400 mx-1">|</span>
          </>
        )}

        {/* Closes */}
        <span className="text-stone-500">Closes:</span>
        <span className="font-bold" style={{ color: getDaysUntilColor() }}>
          {tender.days_until_close > 0
            ? `${tender.days_until_close} DAYS`
            : tender.days_until_close === 0
              ? 'TODAY'
              : 'CLOSED'}
        </span>
        <span className="text-stone-400">
          (<DateDisplay date={tender.closing_date} />)
        </span>

        <span className="text-stone-300 mx-1.5">|</span>

        {/* Briefing */}
        <span className="text-stone-500">Briefing:</span>
        <span className="font-medium">{getBriefingDisplay()}</span>

        <span className="text-stone-300 mx-1.5">|</span>

        {/* Score */}
        <span className="text-stone-500">Score:</span>
        {tender.score_percentage !== null ? (
          <span className="font-bold" style={{ color: scoreColor }}>
            {scoreValue}%
          </span>
        ) : (
          <span className="text-stone-400">N/A</span>
        )}
      </div>

      {/* Row 3: Health bar - full width, integrated */}
      {tender.score_percentage !== null && (
        <div className="mt-2">
          <HealthBar current={scoreValue} max={100} color={scoreColor} segments={20} />
        </div>
      )}

      {/* Row 4: Lifecycle action bar (skeleton — coming soon) */}
      <div className="mt-3 pt-3 border-t border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wide">
            Tender Actions
          </span>
          <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
            coming soon
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all
              bg-emerald-50 text-emerald-700 border border-emerald-200
              hover:bg-emerald-100 hover:border-emerald-300 active:translate-y-px"
          >
            <span>&#9733;</span> Shortlist
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all
              bg-blue-50 text-blue-700 border border-blue-200
              hover:bg-blue-100 hover:border-blue-300 active:translate-y-px"
          >
            <span>&#9998;</span> Review
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all
              bg-amber-50 text-amber-700 border border-amber-200
              hover:bg-amber-100 hover:border-amber-300 active:translate-y-px"
          >
            <span>&#9673;</span> Watch
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all
              bg-stone-50 text-stone-500 border border-stone-200
              hover:bg-stone-100 hover:border-stone-300 active:translate-y-px"
          >
            <span>&#10005;</span> Decline
          </button>
        </div>
      </div>
    </div>
  )
}
