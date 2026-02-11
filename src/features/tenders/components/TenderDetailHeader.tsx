import type { TenderDetail } from '@/lib/types'
import { RecommendationBadge } from '@/components/shared'
import { DateDisplay } from '@/components/shared'
import { HealthBar } from '@/components/ui'

interface TenderDetailHeaderProps {
  tender: TenderDetail
}

export function TenderDetailHeader({ tender }: TenderDetailHeaderProps) {
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
    <div className="px-4 py-2.5 bg-card border-b border-border">
      {/* Row 1: Title + Recommendation Badge */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-h3 font-serif font-semibold text-foreground truncate flex-1">
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
      <div className="mt-0.5 flex items-center flex-wrap gap-x-1 text-body-small">
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
        <div className="mt-1">
          <HealthBar current={scoreValue} max={100} color={scoreColor} segments={20} />
        </div>
      )}
    </div>
  )
}
