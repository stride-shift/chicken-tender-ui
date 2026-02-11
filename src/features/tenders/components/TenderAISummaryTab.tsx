import type { TenderDetail } from '@/lib/types'
import { FormattedSummary } from '@/components/shared/FormattedSummary'

interface TenderAISummaryTabProps {
  tender: TenderDetail
}

export function TenderAISummaryTab({ tender }: TenderAISummaryTabProps) {
  if (!tender.final_report_text) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <p className="text-sm text-muted-foreground">
          No AI summary available for this tender.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h3 className="text-subtitle font-serif font-semibold text-foreground mb-4">
          AI Summary
        </h3>
        <FormattedSummary content={tender.final_report_text} />
      </section>
    </div>
  )
}
