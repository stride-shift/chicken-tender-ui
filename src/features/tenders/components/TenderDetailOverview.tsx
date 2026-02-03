import type { TenderDetail } from '@/lib/types'

interface TenderDetailOverviewProps {
  tender: TenderDetail
}

export function TenderDetailOverview({ tender }: TenderDetailOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Description Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500" />
          <span className="text-xs tracking-widest font-black text-teal-600 font-mono">DESCRIPTION</span>
        </div>
        <div className="bg-white p-4 relative overflow-hidden border border-stone-200">
          <p className="relative z-10 font-mono text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
            {tender.description}
          </p>
        </div>
      </div>

      {/* AI Summary Section */}
      {tender.final_report_text && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500" />
            <span className="text-xs tracking-widest font-black text-purple-600 font-mono">AI SUMMARY</span>
            {tender.quality_score !== null && (
              <QualityScoreBadge score={tender.quality_score} />
            )}
          </div>
          <div className="bg-white p-4 relative overflow-hidden border border-stone-200">
            <div className="relative z-10 font-mono text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
              {tender.final_report_text}
            </div>
            {tender.quality_explanation && (
              <p className="relative z-10 text-xs text-purple-600/70 mt-3 font-mono italic">
                {tender.quality_explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Metadata Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500" />
          <span className="text-xs tracking-widest font-black text-amber-600 font-mono">METADATA</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetadataItem label="DEPARTMENT" value={tender.department_name} />
          <MetadataItem label="PROVINCE" value={tender.province_name} />
          <MetadataItem label="CATEGORY" value={tender.category_name} />
          <MetadataItem label="TENDER TYPE" value={tender.tender_type} />
          <MetadataItem label="ORGAN OF STATE" value={tender.organ_of_state} />
          <MetadataItem
            label="E-SUBMISSION"
            value={tender.allows_esubmission ? 'ALLOWED' : 'NOT ALLOWED'}
            highlight={tender.allows_esubmission}
          />
        </div>
      </div>

      {/* Location Section */}
      {(tender.town || tender.delivery_address) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500" />
            <span className="text-xs tracking-widest font-black text-cyan-600 font-mono">LOCATION</span>
          </div>
          <div className="bg-white p-4 relative overflow-hidden border border-stone-200">
            <div className="relative z-10 space-y-1">
              {tender.town && (
                <p className="font-mono text-stone-700 text-sm">{tender.town}</p>
              )}
              {tender.delivery_address && (
                <p className="font-mono text-stone-500 text-sm">{tender.delivery_address}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetadataItem({
  label,
  value,
  highlight = false
}: {
  label: string;
  value: string | null;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white p-3 relative overflow-hidden border border-stone-200">
      <p className="relative z-10 text-xs font-mono text-stone-500 tracking-wide">{label}</p>
      <p
        className={`relative z-10 text-sm font-mono mt-0.5 ${
          highlight ? 'text-green-600' : 'text-stone-700'
        }`}
      >
        {value || '-'}
      </p>
    </div>
  )
}

function QualityScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 4) return { bg: 'bg-green-100', text: 'text-green-700' }
    if (score >= 3) return { bg: 'bg-blue-100', text: 'text-blue-700' }
    if (score >= 2) return { bg: 'bg-amber-100', text: 'text-amber-700' }
    return { bg: 'bg-stone-100', text: 'text-stone-600' }
  }

  const colors = getColor()

  return (
    <span
      className={`text-xs font-mono font-bold px-2 py-0.5 ${colors.bg} ${colors.text}`}
    >
      Q:{score}/5
    </span>
  )
}
