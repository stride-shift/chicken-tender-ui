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
    if (tender.days_until_close <= 0) return 'hsl(var(--muted-foreground))'
    if (tender.days_until_close <= 3) return 'hsl(var(--destructive))'
    if (tender.days_until_close <= 7) return 'hsl(var(--warning))'
    return 'hsl(var(--success))'
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
    if (score === null) return 'hsl(var(--muted-foreground))'
    if (score >= 80) return 'hsl(var(--success))'
    if (score >= 60) return 'hsl(var(--info))'
    if (score >= 40) return 'hsl(var(--warning))'
    return 'hsl(var(--muted-foreground))'
  }

  const scoreColor = getScoreColor(tender.score_percentage)
  const scoreValue = tender.score_percentage !== null ? Math.round(tender.score_percentage) : 0

  // Build briefing display
  const getBriefingDisplay = () => {
    if (!hasBriefing) return 'None'
    const urgent = isBriefingUrgent()
    return (
      <span style={{ color: urgent ? 'hsl(var(--warning))' : 'hsl(var(--muted-foreground))' }}>
        <DateDisplay date={tender.briefing_datetime!} showRelative />
        {tender.is_briefing_compulsory && <span className="text-destructive ml-0.5">!</span>}
      </span>
    )
  }

  return (
    <div className="p-4 bg-card border-b border-border">
      {/* Row 1: Title + Recommendation Badge */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-title font-serif font-semibold text-foreground truncate flex-1">
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
      <div className="mt-1.5 flex items-center flex-wrap gap-x-1 text-body-small">
        {/* Tender number (if we have a generated title) */}
        {tender.generated_title && (
          <>
            <span className="text-muted-foreground">{tender.tender_no}</span>
            <span className="text-muted-foreground/60 mx-1">|</span>
          </>
        )}

        {/* Closes */}
        <span className="text-muted-foreground">Closes:</span>
        <span className="font-semibold" style={{ color: getDaysUntilColor() }}>
          {tender.days_until_close > 0
            ? `${tender.days_until_close} days`
            : tender.days_until_close === 0
              ? 'Today'
              : 'Closed'}
        </span>
        <span className="text-muted-foreground/80">
          (<DateDisplay date={tender.closing_date} />)
        </span>

        <span className="text-muted-foreground/40 mx-1.5">|</span>

        {/* Briefing */}
        <span className="text-muted-foreground">Briefing:</span>
        <span className="font-medium">{getBriefingDisplay()}</span>

        <span className="text-muted-foreground/40 mx-1.5">|</span>

        {/* Score */}
        <span className="text-muted-foreground">Score:</span>
        {tender.score_percentage !== null ? (
          <span className="font-semibold" style={{ color: scoreColor }}>
            {scoreValue}%
          </span>
        ) : (
          <span className="text-muted-foreground/80">N/A</span>
        )}
      </div>

      {/* Row 3: Health bar - full width, integrated */}
      {tender.score_percentage !== null && (
        <div className="mt-2">
          <HealthBar current={scoreValue} max={100} color={scoreColor} segments={20} />
        </div>
      )}

      {/* Row 4: Lifecycle action bar (skeleton — coming soon) */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-caption font-semibold text-muted-foreground">
            Tender Actions
          </span>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            coming soon
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-caption font-semibold rounded-md transition-all
              bg-success/10 text-success border border-success/30
              hover:bg-success/20 hover:border-success/40 active:translate-y-px shadow-sm"
          >
            <span>&#9733;</span> Shortlist
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-caption font-semibold rounded-md transition-all
              bg-info/10 text-info border border-info/30
              hover:bg-info/20 hover:border-info/40 active:translate-y-px shadow-sm"
          >
            <span>&#9998;</span> Review
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-caption font-semibold rounded-md transition-all
              bg-warning/10 text-warning border border-warning/30
              hover:bg-warning/20 hover:border-warning/40 active:translate-y-px shadow-sm"
          >
            <span>&#9673;</span> Watch
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-caption font-semibold rounded-md transition-all
              bg-muted text-muted-foreground border border-border
              hover:bg-muted/80 hover:border-border active:translate-y-px shadow-sm"
          >
            <span>&#10005;</span> Decline
          </button>
        </div>
      </div>
    </div>
  )
}
