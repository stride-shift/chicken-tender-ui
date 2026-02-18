import { useClientRubric } from '../hooks/useClientRubric'
import { HealthBar } from '@/components/ui'
import type { TenderDetail, RubricKnockout, RubricCriterion, KnockoutResultValue, CriteriaResultValue } from '@/lib/types'

interface TenderDetailEvalProps {
  tender: TenderDetail
}

// Helper to safely parse JSONB that might be a string
function parseJsonb<T>(data: T | string | null | undefined): T | null {
  if (!data) return null
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }
  return data
}

export function TenderDetailEval({ tender }: TenderDetailEvalProps) {
  const { data: rubric, isLoading: rubricLoading } = useClientRubric(tender.rubric_pk)

  const knockoutResults = parseJsonb<Record<string, KnockoutResultValue>>(tender.knockout_results)
  const criteriaResults = parseJsonb<Record<string, CriteriaResultValue>>(tender.criteria_results)

  if (!tender.evaluation_pk) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card shadow-sm p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-body text-muted-foreground">No evaluation available for this tender.</p>
        </div>
      </div>
    )
  }

  // Parse rubric arrays (might be strings from JSONB)
  const rubricKnockouts = rubric ? parseJsonb<RubricKnockout[]>(rubric.knockouts) || [] : []
  const rubricCriteria = rubric ? parseJsonb<RubricCriterion[]>(rubric.criteria) || [] : []

  // Count passed knockouts
  const passedKnockouts = rubricKnockouts.filter(
    (k) => knockoutResults?.[k.id]?.answer === 'YES'
  ).length
  const failedKnockouts = rubricKnockouts.filter(
    (k) => knockoutResults?.[k.id]?.answer === 'NO'
  ).length

  return (
    <div className="space-y-6">
      {/* Header with overall result */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-6 flex items-center justify-between">
        <div>
          <h3 className="text-subtitle font-semibold text-foreground">Rubric Evaluation</h3>
          <p className="text-body text-muted-foreground mt-0.5">
            How this tender was graded against your criteria
          </p>
        </div>
        <div className="text-right">
          <div
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: getScoreColor(tender.score_percentage) }}
          >
            <span className="text-h2 font-semibold tabular-nums text-white">
              {tender.score_percentage !== null ? `${Math.round(tender.score_percentage)}%` : '--'}
            </span>
          </div>
          <div className="text-caption text-muted-foreground mt-1 tabular-nums">
            {tender.score_earned ?? 0}/{tender.score_possible ?? 0} pts
          </div>
        </div>
      </div>

      {/* Knockout Criteria */}
      {rubricKnockouts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-subtitle font-semibold text-foreground">
              Knockout Criteria
            </h4>
            <span
              className={`px-3 py-1 text-caption font-medium rounded-full ${
                failedKnockouts > 0
                  ? 'bg-destructive text-white'
                  : 'bg-success text-white'
              }`}
            >
              {passedKnockouts}/{rubricKnockouts.length} Passed
            </span>
          </div>
          <div className="space-y-3">
            {rubricKnockouts.map((knockout) => {
              const result = knockoutResults?.[knockout.id]
              return (
                <KnockoutChecklistItem
                  key={knockout.id}
                  knockout={knockout}
                  answer={result?.answer}
                  reason={result?.reason}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Scoring Criteria */}
      {rubricCriteria.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-subtitle font-semibold text-foreground">
              Scoring Criteria
            </h4>
            <span className="px-3 py-1 bg-muted text-muted-foreground text-caption font-medium rounded-full tabular-nums">
              {rubricCriteria.length} criteria
            </span>
          </div>
          <div className="space-y-3">
            {rubricCriteria.map((criterion) => {
              const result = criteriaResults?.[criterion.id]
              return (
                <CriteriaGradedItem
                  key={criterion.id}
                  criterion={criterion}
                  answer={result?.answer}
                  evidence={result?.evidence}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Loading state for rubric */}
      {rubricLoading && (
        <div className="rounded-lg border border-border bg-card shadow-sm p-6 text-center">
          <p className="text-body text-muted-foreground">Loading rubric details...</p>
        </div>
      )}

      {/* LLM Analysis Notes */}
      {tender.llm_notes && (
        <div>
          <h4 className="text-subtitle font-semibold text-foreground mb-4">
            Evaluator Notes
          </h4>
          <div className="rounded-lg border border-border bg-info/5 p-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-body text-foreground leading-relaxed whitespace-pre-wrap">
                {tender.llm_notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface KnockoutChecklistItemProps {
  knockout: RubricKnockout
  answer?: 'YES' | 'NO' | 'UNSURE'
  reason?: string
}

function KnockoutChecklistItem({ knockout, answer, reason }: KnockoutChecklistItemProps) {
  const isPassed = answer === 'YES'
  const isFailed = answer === 'NO'
  const isUnsure = answer === 'UNSURE'
  const noAnswer = !answer

  const getIconBgColor = () => {
    if (isPassed) return 'bg-success'
    if (isFailed) return 'bg-destructive'
    if (isUnsure) return 'bg-warning'
    return 'bg-muted-foreground'
  }

  const getBadgeColor = () => {
    if (isPassed) return 'bg-success text-white'
    if (isFailed) return 'bg-destructive text-white'
    if (isUnsure) return 'bg-warning text-white'
    return 'bg-muted-foreground text-white'
  }

  const getCardStyle = () => {
    if (isFailed) return 'bg-destructive/5 border-destructive/20'
    return 'bg-card border-border'
  }

  return (
    <div className={`rounded-lg border shadow-sm p-4 ${getCardStyle()}`}>
      {/* Header row: checkbox, ID, status badge */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${getIconBgColor()}`}>
          {isPassed && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isFailed && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {isUnsure && <span className="text-white font-semibold text-xs">?</span>}
          {noAnswer && <span className="text-white text-xs font-medium">--</span>}
        </div>
        <span className="px-2 py-1 bg-muted text-muted-foreground text-caption font-medium rounded tabular-nums">
          {knockout.id}
        </span>
        {answer && (
          <span className={`px-3 py-1 text-caption font-medium rounded-full ${getBadgeColor()}`}>
            {isPassed ? 'Pass' : isFailed ? 'Fail' : 'Uncertain'}
          </span>
        )}
      </div>

      {/* Question */}
      <p className={`text-body font-medium mb-2 ${isFailed ? 'text-destructive' : 'text-foreground'}`}>
        {knockout.question}
      </p>

      {/* Reason - inline, no label */}
      {reason && (
        <p className="text-body text-muted-foreground leading-relaxed">
          {reason}
        </p>
      )}

      {/* Fail message */}
      {isFailed && knockout.fail_message && (
        <div className="mt-3 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
          <p className="text-caption text-destructive font-medium">{knockout.fail_message}</p>
        </div>
      )}
    </div>
  )
}

interface CriteriaGradedItemProps {
  criterion: RubricCriterion
  answer?: 'YES' | 'NO' | 'UNSURE' | 'PARTIAL'
  evidence?: string
}

function CriteriaGradedItem({ criterion, answer, evidence }: CriteriaGradedItemProps) {
  const getGradeConfig = (ans?: string) => {
    const configs: Record<string, { label: string; color: string; fillBars: number; badgeColor: string }> = {
      YES: {
        label: 'Yes',
        color: 'hsl(142, 71%, 45%)',
        fillBars: 4,
        badgeColor: 'bg-success'
      },
      PARTIAL: {
        label: 'Partial',
        color: 'hsl(217, 91%, 60%)',
        fillBars: 2,
        badgeColor: 'bg-info'
      },
      NO: {
        label: 'No',
        color: 'hsl(0, 84%, 60%)',
        fillBars: 0,
        badgeColor: 'bg-destructive'
      },
      UNSURE: {
        label: 'Unsure',
        color: 'hsl(38, 92%, 50%)',
        fillBars: 1,
        badgeColor: 'bg-warning'
      },
    }
    return configs[ans || ''] || {
      label: '--',
      color: 'hsl(0, 0%, 50%)',
      fillBars: 0,
      badgeColor: 'bg-muted-foreground'
    }
  }

  const grade = getGradeConfig(answer)

  // Calculate score based on answer
  const getScore = () => {
    if (answer === 'YES') return { current: 4, max: 4 }
    if (answer === 'PARTIAL') return { current: 2, max: 4 }
    if (answer === 'UNSURE') return { current: 1, max: 4 }
    return { current: 0, max: 4 }
  }
  const score = getScore()

  // Category badge colors
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      core_fit: { bg: 'bg-primary/10', text: 'text-primary' },
      technical: { bg: 'bg-info/10', text: 'text-info' },
      commercial: { bg: 'bg-accent/10', text: 'text-accent' },
      compliance: { bg: 'bg-warning/10', text: 'text-warning' },
      default: { bg: 'bg-muted', text: 'text-muted-foreground' }
    }
    return styles[category] || styles.default
  }

  const categoryStyle = getCategoryStyle(criterion.category || 'default')

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-4">
      {/* Header row: ID, weight/category tags, grade badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 bg-muted text-muted-foreground text-caption font-medium rounded tabular-nums">
            {criterion.id}
          </span>
          {criterion.weight && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-caption font-medium rounded tabular-nums">
              ×{criterion.weight}
            </span>
          )}
          {criterion.category && (
            <span className={`px-2 py-1 text-caption font-medium rounded ${categoryStyle.bg} ${categoryStyle.text}`}>
              {formatCategory(criterion.category)}
            </span>
          )}
        </div>
        <span className={`flex-shrink-0 px-3 py-1 text-caption font-medium text-white rounded-full ${grade.badgeColor}`}>
          {grade.label}
        </span>
      </div>

      {/* Question */}
      <p className="text-body font-medium text-foreground mb-3">
        {criterion.question}
      </p>

      {/* Visual grade bar - using HealthBar with light variant */}
      <div className="bg-muted p-2 rounded-lg mb-3">
        <HealthBar
          current={score.current}
          max={score.max}
          color={grade.color}
          segments={4}
          variant="light"
        />
      </div>

      {/* Evidence - no label, just the text */}
      {evidence && (
        <p className="text-body text-muted-foreground leading-relaxed">{evidence}</p>
      )}
    </div>
  )
}

function formatCategory(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'hsl(0, 0%, 50%)'
  if (score >= 80) return 'hsl(142, 71%, 45%)' // success
  if (score >= 65) return 'hsl(217, 91%, 60%)' // info
  if (score >= 50) return 'hsl(38, 92%, 50%)' // warning
  return 'hsl(0, 84%, 60%)' // destructive
}
