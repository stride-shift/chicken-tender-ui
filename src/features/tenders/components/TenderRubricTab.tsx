import { useClientRubric } from '../hooks/useClientRubric'
import type { RubricKnockout, RubricCriterion, ScoringConfig, ThresholdRange } from '@/lib/types'

interface TenderRubricTabProps {
  rubricPk: number | null
}

export function TenderRubricTab({ rubricPk }: TenderRubricTabProps) {
  const { data: rubric, isLoading, error } = useClientRubric(rubricPk)

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-48" />
        <div className="h-4 bg-muted rounded w-64" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 text-destructive px-4 py-3">
        <p className="font-semibold">Error loading rubric</p>
        <p className="text-body-sm mt-1">{(error as Error).message}</p>
      </div>
    )
  }

  if (!rubric) {
    return (
      <div className="text-center py-8 rounded-lg border border-border bg-card shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded bg-muted flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-foreground font-semibold">No rubric available</p>
        <p className="text-body-sm text-muted-foreground mt-1">
          This tender has not been evaluated with a rubric.
        </p>
      </div>
    )
  }

  const knockouts = ensureArray<RubricKnockout>(rubric.knockouts)
  const criteria = ensureArray<RubricCriterion>(rubric.criteria)
  const scoringConfig = rubric.scoring_config as ScoringConfig

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h3 className="text-h3 font-semibold text-foreground">Evaluation Rubric</h3>
        <p className="text-caption text-muted-foreground mt-1 tabular-nums">
          Version {rubric.version} - Updated {formatDate(rubric.updated_at)}
        </p>
      </div>

      {/* Knockout Criteria */}
      {knockouts.length > 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-transparent bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground">
                KNOCKOUT
              </span>
              <h4 className="text-subtitle font-semibold text-foreground">Knockout Criteria</h4>
            </div>
            <p className="text-caption text-muted-foreground mt-1">
              These must pass for a tender to be considered relevant.
            </p>
          </div>
          <div className="divide-y divide-border">
            {knockouts.map((knockout, index) => (
              <KnockoutRow key={knockout.id} knockout={knockout} index={index + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Scoring Criteria */}
      {criteria.length > 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-transparent bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                SCORING
              </span>
              <h4 className="text-subtitle font-semibold text-foreground">Scoring Criteria</h4>
            </div>
            <p className="text-caption text-muted-foreground mt-1">
              Tenders are scored on these factors.
            </p>
          </div>
          <div className="divide-y divide-border">
            {criteria.map((criterion) => (
              <CriterionRow key={criterion.id} criterion={criterion} />
            ))}
          </div>
        </div>
      )}

      {/* Scoring Thresholds */}
      {scoringConfig?.thresholds && (
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-transparent bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                THRESHOLDS
              </span>
              <h4 className="text-subtitle font-semibold text-foreground">Scoring Thresholds</h4>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <ThresholdRow
              label="Excellent Fit"
              threshold={scoringConfig.thresholds.excellent_fit}
              colorClass="success"
            />
            <ThresholdRow
              label="Good Fit"
              threshold={scoringConfig.thresholds.good_fit}
              colorClass="info"
            />
            <ThresholdRow
              label="Worth Reviewing"
              threshold={scoringConfig.thresholds.worth_reviewing}
              colorClass="warning"
            />
            {scoringConfig.thresholds.not_recommended && (
              <ThresholdRow
                label="Not Recommended"
                threshold={scoringConfig.thresholds.not_recommended}
                colorClass="muted"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function KnockoutRow({ knockout, index }: { knockout: RubricKnockout; index: number }) {
  return (
    <div className="py-3 border-b border-border last:border-0">
      <div className="flex items-start gap-3 px-4">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted text-foreground text-caption font-semibold flex items-center justify-center tabular-nums">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-body text-foreground">{knockout.question}</p>
          <div className="mt-2 bg-destructive/10 border border-destructive/30 rounded px-2 py-1.5 inline-block">
            <p className="text-caption text-destructive">
              Fail: "{knockout.fail_message}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CriterionRow({ criterion }: { criterion: RubricCriterion }) {
  // Category badge colors
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      core_fit: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
      technical: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/30' },
      commercial: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' },
      compliance: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
      default: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' }
    }
    return styles[category] || styles.default
  }

  const categoryStyle = getCategoryStyle(criterion.category || 'default')

  return (
    <div className="py-3 border-b border-border last:border-0">
      <div className="flex items-start gap-3 px-4">
        <div className="flex-shrink-0 mt-1 w-3 h-3 rounded-full bg-info" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
              {criterion.category ? formatCategoryName(criterion.category) : 'General'}
            </span>
            {criterion.weight > 1 && (
              <span className="inline-flex items-center rounded-full border border-transparent bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground tabular-nums">
                x{criterion.weight}
              </span>
            )}
          </div>
          <p className="text-body text-foreground">"{criterion.question}"</p>
        </div>
      </div>
    </div>
  )
}

function ThresholdRow({
  label,
  threshold,
  colorClass,
}: {
  label: string
  threshold: ThresholdRange
  colorClass: 'success' | 'info' | 'warning' | 'muted'
}) {
  // Calculate fill percentage for health bar visualization
  const midpoint = (threshold.min + threshold.max) / 2

  // Color mappings for badges and progress bars
  const colorMap = {
    success: { badge: 'bg-success text-success-foreground', progress: 'bg-success' },
    info: { badge: 'bg-info text-info-foreground', progress: 'bg-info' },
    warning: { badge: 'bg-warning text-warning-foreground', progress: 'bg-warning' },
    muted: { badge: 'bg-muted text-muted-foreground', progress: 'bg-muted-foreground' }
  }

  const colors = colorMap[colorClass]

  return (
    <div className="p-3 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}>
            {label}
          </span>
          <span className="text-caption text-muted-foreground">{threshold.label}</span>
        </div>
        <span className="text-body-sm font-semibold text-foreground tabular-nums">
          {threshold.min}% - {threshold.max}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all ${colors.progress}`}
          style={{ width: `${midpoint}%` }}
        />
      </div>
    </div>
  )
}

function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper to ensure JSONB data is parsed as array
function ensureArray<T>(data: T[] | string | null | undefined): T[] {
  if (!data) return []
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return Array.isArray(data) ? data : []
}
