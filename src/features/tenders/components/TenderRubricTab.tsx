import { useClientRubric } from '../hooks/useClientRubric'
import { HealthBar } from '@/components/ui'
import type { RubricKnockout, RubricCriterion, ScoringConfig, ThresholdRange } from '@/lib/types'

interface TenderRubricTabProps {
  rubricPk: number | null
}

export function TenderRubricTab({ rubricPk }: TenderRubricTabProps) {
  const { data: rubric, isLoading, error } = useClientRubric(rubricPk)

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-stone-200 rounded w-48" />
        <div className="h-4 bg-stone-100 rounded w-64" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-stone-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded"
        style={{ boxShadow: '3px 3px 0 #fecaca' }}
      >
        <p className="font-black uppercase">Error loading rubric</p>
        <p className="text-sm mt-1">{(error as Error).message}</p>
      </div>
    )
  }

  if (!rubric) {
    return (
      <div
        className="text-center py-8 bg-white rounded border-2 border-stone-200"
        style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
      >
        <div
          className="w-16 h-16 mx-auto mb-4 rounded bg-stone-100 flex items-center justify-center border-2 border-stone-300"
          style={{ boxShadow: '2px 2px 0 #d6d3d1' }}
        >
          <svg
            className="w-8 h-8 text-stone-400"
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
        <p className="text-stone-700 font-bold">No rubric available</p>
        <p className="text-sm text-stone-500 mt-1">
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
      <div
        className="p-4 bg-white rounded border-2 border-stone-200"
        style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
      >
        <h3 className="text-lg font-black text-stone-800 uppercase tracking-wide">Evaluation Rubric</h3>
        <p className="text-sm text-stone-500 mt-1 font-mono">
          Version {rubric.version} - Updated {formatDate(rubric.updated_at)}
        </p>
      </div>

      {/* Knockout Criteria */}
      {knockouts.length > 0 && (
        <div
          className="bg-white rounded border-2 border-stone-200 overflow-hidden"
          style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
        >
          <div className="bg-stone-50 px-4 py-3 border-b-2 border-stone-200">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 text-xs font-black text-white rounded"
                style={{
                  background: 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)',
                  boxShadow: '0 2px 0 #dc2626'
                }}
              >
                KNOCKOUT
              </span>
              <h4 className="text-sm font-black text-stone-800 uppercase">Knockout Criteria</h4>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              These must pass for a tender to be considered relevant.
            </p>
          </div>
          <div className="divide-y-2 divide-stone-100">
            {knockouts.map((knockout, index) => (
              <KnockoutRow key={knockout.id} knockout={knockout} index={index + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Scoring Criteria */}
      {criteria.length > 0 && (
        <div
          className="bg-white rounded border-2 border-stone-200 overflow-hidden"
          style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
        >
          <div className="bg-stone-50 px-4 py-3 border-b-2 border-stone-200">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 text-xs font-black text-white rounded"
                style={{
                  background: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)',
                  boxShadow: '0 2px 0 #2563eb'
                }}
              >
                SCORING
              </span>
              <h4 className="text-sm font-black text-stone-800 uppercase">Scoring Criteria</h4>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Tenders are scored on these factors.
            </p>
          </div>
          <div className="divide-y-2 divide-stone-100">
            {criteria.map((criterion) => (
              <CriterionRow key={criterion.id} criterion={criterion} />
            ))}
          </div>
        </div>
      )}

      {/* Scoring Thresholds */}
      {scoringConfig?.thresholds && (
        <div
          className="bg-white rounded border-2 border-stone-200 overflow-hidden"
          style={{ boxShadow: '3px 3px 0 #d6d3d1' }}
        >
          <div className="bg-stone-50 px-4 py-3 border-b-2 border-stone-200">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 text-xs font-black text-white rounded"
                style={{
                  background: 'linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)',
                  boxShadow: '0 2px 0 #7c3aed'
                }}
              >
                THRESHOLDS
              </span>
              <h4 className="text-sm font-black text-stone-800 uppercase">Scoring Thresholds</h4>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <ThresholdRow
              label="Excellent Fit"
              threshold={scoringConfig.thresholds.excellent_fit}
              gradient="linear-gradient(180deg, #4ade80 0%, #22c55e 100%)"
              shadowColor="#16a34a"
            />
            <ThresholdRow
              label="Good Fit"
              threshold={scoringConfig.thresholds.good_fit}
              gradient="linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)"
              shadowColor="#2563eb"
            />
            <ThresholdRow
              label="Worth Reviewing"
              threshold={scoringConfig.thresholds.worth_reviewing}
              gradient="linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)"
              shadowColor="#d97706"
            />
            {scoringConfig.thresholds.not_recommended && (
              <ThresholdRow
                label="Not Recommended"
                threshold={scoringConfig.thresholds.not_recommended}
                gradient="linear-gradient(180deg, #a8a29e 0%, #78716c 100%)"
                shadowColor="#57534e"
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
    <div className="px-4 py-3 bg-white hover:bg-stone-50 transition-colors">
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 w-7 h-7 rounded text-white text-xs font-black flex items-center justify-center"
          style={{
            background: 'linear-gradient(180deg, #a8a29e 0%, #78716c 100%)',
            boxShadow: '0 2px 0 #57534e'
          }}
        >
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-stone-700 font-medium">{knockout.question}</p>
          <div
            className="mt-2 bg-red-50 border border-red-200 rounded px-2 py-1.5 inline-block"
          >
            <p className="text-xs text-red-700 font-medium">
              Fail: "{knockout.fail_message}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CriterionRow({ criterion }: { criterion: RubricCriterion }) {
  // Category badge colors - light arcade style
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      core_fit: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
      technical: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      commercial: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      compliance: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
      default: { bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' }
    }
    return styles[category] || styles.default
  }

  const categoryStyle = getCategoryStyle(criterion.category || 'default')

  return (
    <div className="px-4 py-3 bg-white hover:bg-stone-50 transition-colors">
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 mt-1 w-3 h-3 rounded"
          style={{
            background: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)',
            boxShadow: '0 1px 0 #2563eb'
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`px-2 py-0.5 text-xs font-bold rounded border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
              {criterion.category ? formatCategoryName(criterion.category) : 'General'}
            </span>
            {criterion.weight > 1 && (
              <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-mono font-bold rounded">
                x{criterion.weight}
              </span>
            )}
          </div>
          <p className="text-sm text-stone-700">"{criterion.question}"</p>
        </div>
      </div>
    </div>
  )
}

function ThresholdRow({
  label,
  threshold,
  gradient,
  shadowColor,
}: {
  label: string
  threshold: ThresholdRange
  gradient: string
  shadowColor: string
}) {
  // Calculate fill percentage for health bar visualization
  const midpoint = (threshold.min + threshold.max) / 2

  return (
    <div
      className="p-3 bg-stone-50 rounded border-2 border-stone-200"
      style={{ boxShadow: '2px 2px 0 #e7e5e4' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-1 text-xs font-black text-white rounded"
            style={{
              background: gradient,
              boxShadow: `0 2px 0 ${shadowColor}`
            }}
          >
            {label.toUpperCase()}
          </span>
          <span className="text-xs text-stone-500">{threshold.label}</span>
        </div>
        <span className="text-sm font-mono font-bold text-stone-700">
          {threshold.min}% - {threshold.max}%
        </span>
      </div>
      <HealthBar
        current={midpoint}
        max={100}
        color={shadowColor}
        segments={10}
        variant="light"
      />
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
