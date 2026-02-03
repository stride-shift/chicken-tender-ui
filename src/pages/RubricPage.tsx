import { useActiveClientRubric } from '@/features/tenders/hooks/useActiveClientRubric'
import { PixelBox } from '@/components/ui/PixelBox'
import type { RubricKnockout, RubricCriterion, ScoringConfig, ThresholdRange } from '@/lib/types'

export function RubricPage() {
  const { data: rubric, isLoading, error } = useActiveClientRubric()

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton with arcade styling */}
        <div className="h-8 bg-stone-200 w-48 animate-pulse" />
        <PixelBox color="#d6d3d1" className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-stone-200 w-64 animate-pulse" />
            <div className="h-4 bg-stone-100 w-48 animate-pulse" />
            <div className="space-y-3 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-stone-100 animate-pulse" />
              ))}
            </div>
          </div>
        </PixelBox>
      </div>
    )
  }

  if (error) {
    return (
      <PixelBox color="#dc2626" bgColor="#fef2f2" className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-red-500" />
          <span className="text-sm font-black text-red-700 uppercase tracking-wider">
            ERROR
          </span>
        </div>
        <p className="font-medium text-red-800">{(error as Error).message}</p>
      </PixelBox>
    )
  }

  if (!rubric) {
    return (
      <PixelBox color="#d6d3d1" className="p-8">
        <div className="text-center">
          {/* Pixel clipboard icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 flex items-center justify-center"
            style={{
              border: '3px solid #a8a29e',
              boxShadow: '4px 4px 0 #d6d3d133'
            }}
          >
            <svg
              className="w-8 h-8 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="font-black text-stone-700 uppercase tracking-wider">No rubric configured</p>
          <p className="text-sm text-stone-500 mt-2">
            Contact your administrator to set up an evaluation rubric.
          </p>
        </div>
      </PixelBox>
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
      <PixelBox color="#2d8f8f" className="p-6">
        {/* Header Info */}
        <div className="flex items-center justify-between pb-4 mb-6"
          style={{ borderBottom: '2px dashed #e7e5e4' }}
        >
          <div>
            <p className="font-black text-stone-800 uppercase tracking-wider">{rubric.client_name}</p>
            <p className="text-xs text-stone-500 mt-1">
              Version {rubric.version} - Last updated {formatDate(rubric.updated_at)}
            </p>
          </div>
          {rubric.is_active && (
            <span
              className="inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-wider"
              style={{
                background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
                color: 'white',
                boxShadow: '0 3px 0 #16a34a'
              }}
            >
              ACTIVE
            </span>
          )}
        </div>

        {/* Description */}
        {rubric.description && (
          <div
            className="mb-6 p-4 bg-sky-50"
            style={{
              border: '3px solid #0ea5e9',
              boxShadow: '4px 4px 0 #0ea5e944'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-sky-500" />
              <span className="text-sm font-black text-sky-700 uppercase tracking-wider">
                ABOUT THIS RUBRIC
              </span>
            </div>
            <p className="text-sm text-sky-900 leading-relaxed whitespace-pre-wrap">
              {rubric.description}
            </p>
          </div>
        )}

        {/* Knockout Criteria */}
        {knockouts.length > 0 && (
          <div className="mb-6">
            <div
              className="bg-red-50 px-4 py-3 mb-0"
              style={{
                border: '3px solid #ef4444',
                borderBottom: '2px solid #ef4444'
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500" />
                <span className="text-sm font-black text-red-700 uppercase tracking-wider">
                  KNOCKOUT CRITERIA
                </span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                These must pass for a tender to be considered relevant. A "NO" answer disqualifies the tender.
              </p>
            </div>
            <div
              className="bg-white divide-y-2 divide-red-100"
              style={{
                border: '3px solid #ef4444',
                borderTop: 'none',
                boxShadow: '4px 4px 0 #ef444444'
              }}
            >
              {knockouts.map((knockout, index) => (
                <KnockoutRow key={knockout.id} knockout={knockout} index={index + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Scoring Criteria */}
        {criteria.length > 0 && (
          <div className="mb-6">
            <div
              className="bg-teal-50 px-4 py-3 mb-0"
              style={{
                border: '3px solid #2d8f8f',
                borderBottom: '2px solid #2d8f8f'
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-600" />
                <span className="text-sm font-black text-teal-700 uppercase tracking-wider">
                  SCORING CRITERIA
                </span>
              </div>
              <p className="text-xs text-teal-600 mt-1">
                Tenders are scored on these factors. Higher weights indicate more important criteria.
              </p>
            </div>
            <div
              className="bg-white divide-y-2 divide-teal-100"
              style={{
                border: '3px solid #2d8f8f',
                borderTop: 'none',
                boxShadow: '4px 4px 0 #2d8f8f44'
              }}
            >
              {criteria.map((criterion) => (
                <CriterionRow key={criterion.id} criterion={criterion} />
              ))}
            </div>
          </div>
        )}

        {/* Scoring Thresholds */}
        {scoringConfig?.thresholds && (
          <div>
            <div
              className="bg-amber-50 px-4 py-3 mb-0"
              style={{
                border: '3px solid #f59e0b',
                borderBottom: '2px solid #f59e0b'
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500" />
                <span className="text-sm font-black text-amber-700 uppercase tracking-wider">
                  RECOMMENDATION THRESHOLDS
                </span>
              </div>
              <p className="text-xs text-amber-600 mt-1">
                Score ranges that determine tender recommendations.
              </p>
            </div>
            <div
              className="bg-white p-4 space-y-3"
              style={{
                border: '3px solid #f59e0b',
                borderTop: 'none',
                boxShadow: '4px 4px 0 #f59e0b44'
              }}
            >
              <ThresholdRow
                label="EXCELLENT FIT"
                threshold={scoringConfig.thresholds.excellent_fit}
                color="#22c55e"
                bgColor="#f0fdf4"
              />
              <ThresholdRow
                label="GOOD FIT"
                threshold={scoringConfig.thresholds.good_fit}
                color="#0ea5e9"
                bgColor="#f0f9ff"
              />
              <ThresholdRow
                label="WORTH REVIEWING"
                threshold={scoringConfig.thresholds.worth_reviewing}
                color="#f59e0b"
                bgColor="#fffbeb"
              />
              {scoringConfig.thresholds.not_recommended && (
                <ThresholdRow
                  label="NOT RECOMMENDED"
                  threshold={scoringConfig.thresholds.not_recommended}
                  color="#78716c"
                  bgColor="#fafaf9"
                />
              )}
            </div>
          </div>
        )}
      </PixelBox>
    </div>
  )
}

function KnockoutRow({ knockout, index }: { knockout: RubricKnockout; index: number }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 w-7 h-7 text-xs font-black flex items-center justify-center text-white"
          style={{
            background: 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)',
            boxShadow: '0 2px 0 #b91c1c'
          }}
        >
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-stone-700 font-medium">{knockout.question}</p>
          <p className="text-xs text-red-600 mt-1 font-medium">
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
        <span className="flex-shrink-0 mt-1 w-3 h-3 bg-teal-500" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-black text-stone-700 uppercase tracking-wider">
              {criterion.category ? formatCategoryName(criterion.category) : 'General'}
            </p>
            {criterion.weight > 1 && (
              <span
                className="text-xs px-2 py-0.5 font-black text-teal-700"
                style={{
                  background: '#ccfbf1',
                  border: '2px solid #2d8f8f'
                }}
              >
                {criterion.weight}x
              </span>
            )}
          </div>
          <p className="text-sm text-stone-600 mt-1">"{criterion.question}"</p>
          {criterion.unsure_handling && criterion.unsure_handling !== 'neutral' && (
            <p className="text-xs text-stone-400 mt-1">
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
  color,
  bgColor,
}: {
  label: string
  threshold: ThresholdRange
  color: string
  bgColor: string
}) {
  return (
    <div
      className="flex items-center justify-between text-sm p-3"
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${color}`,
        boxShadow: `3px 3px 0 ${color}44`
      }}
    >
      <div className="flex flex-col">
        <span className="font-black uppercase tracking-wider text-xs" style={{ color }}>
          {label}
        </span>
        <span className="text-xs text-stone-500">{threshold.label}</span>
      </div>
      <span
        className="font-black px-2 py-1 text-white text-xs"
        style={{
          backgroundColor: color,
          boxShadow: `0 2px 0 ${color}88`
        }}
      >
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
