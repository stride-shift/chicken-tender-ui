import { useActiveClientRubric } from '@/features/tenders/hooks/useActiveClientRubric'
import type { RubricKnockout, RubricCriterion, ScoringConfig, ThresholdRange } from '@/lib/types'

export function RubricPage() {
  const { data: rubric, isLoading, error } = useActiveClientRubric()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted w-48 animate-pulse rounded" />
        <div className="rounded-lg border border-border bg-card shadow-sm p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted w-64 animate-pulse rounded" />
            <div className="h-4 bg-muted w-48 animate-pulse rounded" />
            <div className="space-y-3 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-sans font-semibold text-destructive">
            Error
          </span>
        </div>
        <p className="text-sm text-foreground">{(error as Error).message}</p>
      </div>
    )
  }

  if (!rubric) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="font-sans font-semibold text-foreground">No rubric configured</p>
          <p className="text-sm text-muted-foreground mt-2">
            Contact your administrator to set up an evaluation rubric.
          </p>
        </div>
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
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        {/* Header Info */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
          <div>
            <h1 className="text-headline font-sans text-foreground">{rubric.client_name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Version {rubric.version} - Last updated {formatDate(rubric.updated_at)}
            </p>
          </div>
          {rubric.is_active && (
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-success rounded-md shadow-sm">
              Active
            </span>
          )}
        </div>

        {/* Description */}
        {rubric.description && (
          <div className="mb-6 p-4 rounded-lg border border-info/30 bg-info/5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-info" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-sans font-semibold text-info">
                About this rubric
              </span>
            </div>
            <p className="text-sm text-foreground font-light leading-relaxed whitespace-pre-wrap">
              {rubric.description}
            </p>
          </div>
        )}

        {/* Knockout Criteria */}
        {knockouts.length > 0 && (
          <div className="mb-6">
            <div className="rounded-t-lg border border-destructive bg-destructive/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                <span className="font-sans font-semibold text-destructive">
                  Knockout Criteria
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                These must pass for a tender to be considered relevant. A "NO" answer disqualifies the tender.
              </p>
            </div>
            <div className="rounded-b-lg border border-t-0 border-destructive bg-card divide-y divide-border">
              {knockouts.map((knockout, index) => (
                <KnockoutRow key={knockout.id} knockout={knockout} index={index + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Scoring Criteria */}
        {criteria.length > 0 && (
          <div className="mb-6">
            <div className="rounded-t-lg border border-primary bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-sans font-semibold text-primary">
                  Scoring Criteria
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tenders are scored on these factors. Higher weights indicate more important criteria.
              </p>
            </div>
            <div className="rounded-b-lg border border-t-0 border-primary bg-card divide-y divide-border">
              {criteria.map((criterion) => (
                <CriterionRow key={criterion.id} criterion={criterion} />
              ))}
            </div>
          </div>
        )}

        {/* Scoring Thresholds */}
        {scoringConfig?.thresholds && (
          <div>
            <div className="rounded-t-lg border border-warning bg-warning/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
                <span className="font-sans font-semibold text-warning">
                  Recommendation Thresholds
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Score ranges that determine tender recommendations.
              </p>
            </div>
            <div className="rounded-b-lg border border-t-0 border-warning bg-card p-4 space-y-3">
              <ThresholdRow
                label="Excellent Fit"
                threshold={scoringConfig.thresholds.excellent_fit}
                variant="success"
              />
              <ThresholdRow
                label="Good Fit"
                threshold={scoringConfig.thresholds.good_fit}
                variant="info"
              />
              <ThresholdRow
                label="Worth Reviewing"
                threshold={scoringConfig.thresholds.worth_reviewing}
                variant="warning"
              />
              {scoringConfig.thresholds.not_recommended && (
                <ThresholdRow
                  label="Not Recommended"
                  threshold={scoringConfig.thresholds.not_recommended}
                  variant="muted"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function KnockoutRow({ knockout, index }: { knockout: RubricKnockout; index: number }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-7 h-7 text-xs font-semibold flex items-center justify-center text-white bg-destructive rounded-md shadow-sm tabular-nums">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground font-light">{knockout.question}</p>
          <p className="text-xs text-destructive mt-1">
            Fail: "{knockout.fail_message}"
          </p>
        </div>
      </div>
    </div>
  )
}

function CriterionRow({ criterion }: { criterion: RubricCriterion }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <svg className="flex-shrink-0 w-4 h-4 mt-1 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-sans font-semibold text-foreground">
              {criterion.category ? formatCategoryName(criterion.category) : 'General'}
            </p>
            {criterion.weight > 1 && (
              <span className="text-xs px-2 py-0.5 font-semibold text-primary bg-primary/10 rounded border border-primary/30 tabular-nums">
                {criterion.weight}x
              </span>
            )}
          </div>
          <p className="text-sm text-foreground font-light mt-1">"{criterion.question}"</p>
          {criterion.unsure_handling && criterion.unsure_handling !== 'neutral' && (
            <p className="text-xs text-muted-foreground mt-1">
              Unsure handling: {criterion.unsure_handling}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ThresholdRow({
  label,
  threshold,
  variant,
}: {
  label: string
  threshold: ThresholdRange
  variant: 'success' | 'info' | 'warning' | 'muted'
}) {
  const variantClasses = {
    success: 'border-success bg-success/10 text-success',
    info: 'border-info bg-info/10 text-info',
    warning: 'border-warning bg-warning/10 text-warning',
    muted: 'border-border bg-muted text-muted-foreground',
  }

  const badgeClasses = {
    success: 'bg-success text-white',
    info: 'bg-info text-white',
    warning: 'bg-warning text-white',
    muted: 'bg-muted-foreground text-white',
  }

  return (
    <div className={`flex items-center justify-between text-sm p-3 rounded-lg border ${variantClasses[variant]}`}>
      <div className="flex flex-col">
        <span className="font-sans font-semibold text-xs">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{threshold.label}</span>
      </div>
      <span className={`font-semibold px-2 py-1 text-xs rounded shadow-sm tabular-nums ${badgeClasses[variant]}`}>
        {threshold.min}% - {threshold.max}%
      </span>
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
