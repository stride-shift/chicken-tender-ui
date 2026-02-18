import type { TenderDetail } from '@/lib/types'

interface TenderDetailOverviewProps {
  tender: TenderDetail
}

export function TenderDetailOverview({ tender }: TenderDetailOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Description Section */}
      <div className="space-y-3">
        <h3 className="text-subtitle font-semibold text-foreground">
          Description
        </h3>
        <div className="rounded-lg border border-border bg-card shadow-sm p-6">
          <p className="text-body text-foreground leading-relaxed whitespace-pre-wrap">
            {tender.description}
          </p>
        </div>
      </div>

      {/* AI Summary Section */}
      {tender.final_report_text && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-subtitle font-semibold text-foreground">
              AI Summary
            </h3>
            {tender.quality_score !== null && (
              <QualityScoreBadge score={tender.quality_score} />
            )}
          </div>
          <div className="rounded-lg border border-border bg-card shadow-sm p-6">
            <div className="text-body text-foreground leading-relaxed whitespace-pre-wrap">
              {tender.final_report_text}
            </div>
            {tender.quality_explanation && (
              <p className="text-body-small text-muted-foreground mt-3 italic">
                {tender.quality_explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Metadata Grid */}
      <div className="space-y-3">
        <h3 className="text-subtitle font-semibold text-foreground">
          Metadata
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <MetadataItem label="Department" value={tender.department_name} />
          <MetadataItem label="Province" value={tender.province_name} />
          <MetadataItem label="Category" value={tender.category_name} />
          <MetadataItem label="Tender Type" value={tender.tender_type} />
          <MetadataItem label="Organ of State" value={tender.organ_of_state} />
          <MetadataItem
            label="E-Submission"
            value={tender.allows_esubmission ? 'Allowed' : 'Not Allowed'}
            highlight={tender.allows_esubmission}
          />
        </div>
      </div>

      {/* Location Section */}
      {(tender.town || tender.delivery_address) && (
        <div className="space-y-3">
          <h3 className="text-subtitle font-semibold text-foreground">
            Location
          </h3>
          <div className="rounded-lg border border-border bg-card shadow-sm p-6">
            <div className="space-y-1">
              {tender.town && (
                <p className="text-body text-foreground">{tender.town}</p>
              )}
              {tender.delivery_address && (
                <p className="text-body text-muted-foreground">{tender.delivery_address}</p>
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
    <div className="rounded-lg border border-border bg-card shadow-sm p-4">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p
        className={`text-body mt-0.5 ${
          highlight ? 'text-success' : 'text-foreground'
        }`}
      >
        {value || '-'}
      </p>
    </div>
  )
}

function QualityScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 4) return { bg: 'bg-success/10', text: 'text-success' }
    if (score >= 3) return { bg: 'bg-info/10', text: 'text-info' }
    if (score >= 2) return { bg: 'bg-warning/10', text: 'text-warning' }
    return { bg: 'bg-muted', text: 'text-muted-foreground' }
  }

  const colors = getColor()

  return (
    <span
      className={`text-caption font-semibold px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}
    >
      Q:{score}/5
    </span>
  )
}
