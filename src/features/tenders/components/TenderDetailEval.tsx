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
        <div
          className="bg-white p-6 text-center rounded border-2 border-stone-200"
          style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
        >
          <div
            className="w-12 h-12 mx-auto mb-3 rounded bg-stone-100 flex items-center justify-center border-2 border-stone-300"
            style={{ boxShadow: '2px 2px 0 #d6d3d1' }}
          >
            <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm text-stone-500 font-medium">No evaluation available for this tender.</p>
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
      <div
        className="flex items-center justify-between p-4 bg-white rounded border-2 border-stone-200"
        style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
      >
        <div>
          <h3 className="text-lg font-black text-stone-800 uppercase tracking-wide">Rubric Evaluation</h3>
          <p className="text-sm text-stone-500 mt-0.5">
            How this tender was graded against your criteria
          </p>
        </div>
        <div className="text-right">
          <div
            className="px-4 py-2 rounded"
            style={{
              background: getScoreGradient(tender.score_percentage),
              boxShadow: '0 3px 0 rgba(0,0,0,0.2)'
            }}
          >
            <span className="text-2xl font-black text-white" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
              {tender.score_percentage !== null ? `${Math.round(tender.score_percentage)}%` : '--'}
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 font-mono">
            {tender.score_earned ?? 0}/{tender.score_possible ?? 0} pts
          </div>
        </div>
      </div>

      {/* Knockout Criteria */}
      {rubricKnockouts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-black text-stone-800 uppercase tracking-wide">
              Knockout Criteria
            </h4>
            <span
              className="px-3 py-1 text-xs font-black text-white rounded"
              style={{
                background: failedKnockouts > 0
                  ? 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)'
                  : 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
                boxShadow: '0 2px 0 rgba(0,0,0,0.2)'
              }}
            >
              {passedKnockouts}/{rubricKnockouts.length} PASSED
            </span>
          </div>
          <div className="space-y-2">
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
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-black text-stone-800 uppercase tracking-wide">
              Scoring Criteria
            </h4>
            <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-mono font-bold rounded">
              {rubricCriteria.length} criteria
            </span>
          </div>
          <div className="space-y-2">
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
        <div
          className="text-center py-4 bg-white rounded border-2 border-stone-200"
          style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
        >
          <p className="text-sm text-stone-500 font-medium">Loading rubric details...</p>
        </div>
      )}

      {/* LLM Analysis Notes */}
      {tender.llm_notes && (
        <div>
          <h4 className="text-sm font-black text-stone-800 uppercase tracking-wide mb-3">
            Evaluator Notes
          </h4>
          <div
            className="bg-blue-50 p-4 rounded border-2 border-blue-200"
            style={{ boxShadow: '3px 3px 0 #bfdbfe' }}
          >
            <div className="flex gap-3">
              <div
                className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded flex items-center justify-center border-2 border-blue-300"
                style={{ boxShadow: '2px 2px 0 #93c5fd' }}
              >
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
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

  const getBadgeStyle = () => {
    if (isPassed) return {
      background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
      boxShadow: '0 2px 0 #16a34a'
    }
    if (isFailed) return {
      background: 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)',
      boxShadow: '0 2px 0 #dc2626'
    }
    if (isUnsure) return {
      background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)',
      boxShadow: '0 2px 0 #d97706'
    }
    return {
      background: 'linear-gradient(180deg, #a8a29e 0%, #78716c 100%)',
      boxShadow: '0 2px 0 #57534e'
    }
  }

  const getBgColor = () => {
    if (isFailed) return 'bg-red-50 border-red-200'
    return 'bg-white border-stone-200'
  }

  return (
    <div
      className={`p-4 rounded border-2 ${getBgColor()}`}
      style={{ boxShadow: isFailed ? '3px 3px 0 #fecaca' : '3px 3px 0 #d6d3d1' }}
    >
      {/* Header row: checkbox, ID, status badge */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
          style={getBadgeStyle()}
        >
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
          {isUnsure && <span className="text-white font-black text-xs">?</span>}
          {noAnswer && <span className="text-white text-xs font-bold">--</span>}
        </div>
        <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-mono font-bold rounded">
          {knockout.id}
        </span>
        {answer && (
          <span
            className="px-3 py-1 text-xs font-black text-white rounded"
            style={getBadgeStyle()}
          >
            {isPassed ? 'PASS' : isFailed ? 'FAIL' : 'UNCERTAIN'}
          </span>
        )}
      </div>

      {/* Question */}
      <p className={`text-sm font-medium ${isFailed ? 'text-red-800' : 'text-stone-700'} mb-2`}>
        {knockout.question}
      </p>

      {/* Reason - inline, no label */}
      {reason && (
        <p className="text-sm text-stone-500 leading-relaxed">
          {reason}
        </p>
      )}

      {/* Fail message */}
      {isFailed && knockout.fail_message && (
        <div
          className="mt-3 bg-red-100 border-2 border-red-300 rounded px-3 py-2"
          style={{ boxShadow: '2px 2px 0 #fca5a5' }}
        >
          <p className="text-xs text-red-700 font-medium">{knockout.fail_message}</p>
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
    const configs: Record<string, { label: string; color: string; fillBars: number; gradient: string; shadowColor: string }> = {
      YES: {
        label: 'YES',
        color: '#22c55e',
        fillBars: 4,
        gradient: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
        shadowColor: '#16a34a'
      },
      PARTIAL: {
        label: 'PARTIAL',
        color: '#3b82f6',
        fillBars: 2,
        gradient: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)',
        shadowColor: '#2563eb'
      },
      NO: {
        label: 'NO',
        color: '#ef4444',
        fillBars: 0,
        gradient: 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)',
        shadowColor: '#dc2626'
      },
      UNSURE: {
        label: 'UNSURE',
        color: '#f59e0b',
        fillBars: 1,
        gradient: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)',
        shadowColor: '#d97706'
      },
    }
    return configs[ans || ''] || {
      label: '--',
      color: '#78716c',
      fillBars: 0,
      gradient: 'linear-gradient(180deg, #a8a29e 0%, #78716c 100%)',
      shadowColor: '#57534e'
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

  // Category badge colors - light arcade style
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      core_fit: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
      technical: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
      commercial: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
      compliance: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
      default: { bg: 'bg-stone-50 border-stone-200', text: 'text-stone-600' }
    }
    return styles[category] || styles.default
  }

  const categoryStyle = getCategoryStyle(criterion.category || 'default')

  return (
    <div
      className="p-4 bg-white rounded border-2 border-stone-200"
      style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
    >
      {/* Header row: ID, weight/category tags, grade badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-mono font-bold rounded">
            {criterion.id}
          </span>
          {criterion.weight && (
            <span className="px-2 py-1 bg-stone-100 text-stone-500 text-xs font-bold rounded">
              x{criterion.weight}
            </span>
          )}
          {criterion.category && (
            <span className={`px-2 py-1 text-xs font-bold rounded border ${categoryStyle.bg} ${categoryStyle.text}`}>
              {formatCategory(criterion.category)}
            </span>
          )}
        </div>
        <span
          className="flex-shrink-0 px-3 py-1 text-xs font-black text-white rounded"
          style={{
            background: grade.gradient,
            boxShadow: `0 2px 0 ${grade.shadowColor}`
          }}
        >
          {grade.label}
        </span>
      </div>

      {/* Question */}
      <p className="text-sm text-stone-700 font-medium mb-3">
        {criterion.question}
      </p>

      {/* Visual grade bar - using HealthBar with light variant */}
      <div className="bg-stone-100 p-2 rounded mb-3">
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
        <p className="text-sm text-stone-500 leading-relaxed">{evidence}</p>
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

function getScoreGradient(score: number | null): string {
  if (score === null) return 'linear-gradient(180deg, #a8a29e 0%, #78716c 100%)'
  if (score >= 80) return 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)'
  if (score >= 65) return 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)'
  if (score >= 50) return 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)'
  return 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)'
}
