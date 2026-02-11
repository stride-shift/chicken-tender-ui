import type { TenderDetail } from '@/lib/types'
import { Markdown } from '@/components/shared/Markdown'
import { FormattedSummary } from '@/components/shared/FormattedSummary'
import { DateDisplay, formatDateTime } from '@/components/shared'

interface TenderOpportunityTabProps {
  tender: TenderDetail
}

export function TenderOpportunityTab({ tender }: TenderOpportunityTabProps) {
  const hasContact =
    tender.contact_person || tender.contact_email || tender.contact_phone
  const hasBriefing = tender.has_briefing_session

  return (
    <div className="space-y-6">
      {/* TODO: Extract this Evaluator Notes section into a shared <EvaluatorNotes /> component
          to be reused here and in TenderDetailEval.tsx */}
      {/* Evaluator Notes - duplicated from TenderDetailEval */}
      {tender.llm_notes && (
        <section className="rounded-lg border border-border bg-card shadow-sm p-6">
          <h3 className="text-subtitle font-serif font-semibold text-foreground mb-4">
            Evaluator Notes
          </h3>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-info/10 rounded flex items-center justify-center border border-info/20">
              <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-body text-foreground leading-relaxed whitespace-pre-wrap">
              {tender.llm_notes}
            </p>
          </div>
        </section>
      )}

      {/* AI Summary */}
      {tender.final_report_text && (
        <section className="rounded-lg border border-border bg-card shadow-sm p-6">
          <h3 className="text-subtitle font-serif font-semibold text-foreground mb-4">
            AI Summary
          </h3>
          <FormattedSummary content={tender.final_report_text} />
        </section>
      )}

      {/* Description */}
      <section className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h3 className="text-subtitle font-serif font-semibold text-foreground mb-4">
          Description
        </h3>
        <div className="prose prose-stone max-w-none">
          <Markdown content={tender.description} />
        </div>
      </section>

      {/* Metadata */}
      <section className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h3 className="text-subtitle font-serif font-semibold text-foreground mb-4">
          Metadata
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <MetadataItem label="Category" value={tender.category_name} />
          <MetadataItem label="Department" value={tender.department_name} />
          <MetadataItem label="Province" value={tender.province_name} />
          <MetadataItem label="Tender Type" value={tender.tender_type} />
          <MetadataItem label="Organ of State" value={tender.organ_of_state} />
          <MetadataItem label="Town" value={tender.town} />
          <MetadataItem
            label="E-Submission"
            value={tender.allows_esubmission ? 'Allowed' : 'Not allowed'}
          />
          {tender.delivery_address && (
            <MetadataItem
              label="Delivery Address"
              value={tender.delivery_address}
            />
          )}
        </div>
      </section>

      {/* Contact & Briefing */}
      <section className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h3 className="text-subtitle font-serif font-semibold text-foreground mb-4">
          Contact & Briefing
        </h3>
        <div className="space-y-4">
          {/* Contact Information */}
          <div>
            <p className="text-body-sm font-semibold text-foreground mb-2">
              Contact Information
            </p>
            {hasContact ? (
              <div className="space-y-2">
                {tender.contact_person && (
                  <ContactItem label="Contact Person" value={tender.contact_person} />
                )}
                {tender.contact_email && (
                  <ContactItem
                    label="Email"
                    value={tender.contact_email}
                    href={`mailto:${tender.contact_email}`}
                  />
                )}
                {tender.contact_phone && (
                  <ContactItem
                    label="Phone"
                    value={tender.contact_phone}
                    href={`tel:${tender.contact_phone}`}
                  />
                )}
              </div>
            ) : (
              <p className="text-body-sm text-muted-foreground">
                No contact information available.
              </p>
            )}
          </div>

          {/* Briefing Session */}
          {hasBriefing && (
            <div className="pt-4 border-t border-border">
              <p className="text-body-sm font-semibold text-foreground mb-2">
                Briefing Session
              </p>
              <div
                className={`rounded-lg p-3 border ${
                  tender.is_briefing_compulsory
                    ? 'bg-warning/10 border-warning/30'
                    : 'bg-muted border-border'
                }`}
              >
                {tender.is_briefing_compulsory && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full border border-warning bg-warning/20 px-2.5 py-0.5 text-xs font-semibold text-warning">
                      COMPULSORY
                    </span>
                    <span className="text-caption text-muted-foreground">
                      Attendance required to submit bid
                    </span>
                  </div>
                )}
                <div className="space-y-2">
                  {tender.briefing_datetime && (
                    <div>
                      <p className="text-caption text-muted-foreground">
                        Date & Time
                      </p>
                      <p className="text-body font-semibold text-foreground mt-0.5 tabular-nums">
                        {formatDateTime(tender.briefing_datetime)}
                      </p>
                      <p className="text-caption text-muted-foreground mt-0.5">
                        <DateDisplay date={tender.briefing_datetime} showRelative />
                      </p>
                    </div>
                  )}
                  {tender.briefing_venue && (
                    <div>
                      <p className="text-caption text-muted-foreground">
                        Venue
                      </p>
                      <p className="text-body text-foreground mt-0.5 whitespace-pre-wrap">
                        {tender.briefing_venue}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!hasBriefing && (
            <div className="pt-4 border-t border-border">
              <p className="text-body-sm font-semibold text-foreground mb-2">
                Briefing Session
              </p>
              <p className="text-body-sm text-muted-foreground">No briefing session scheduled.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function MetadataItem({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div>
      <p className="text-caption text-muted-foreground">
        {label}
      </p>
      <p className="text-body text-foreground mt-0.5">{value || '-'}</p>
    </div>
  )
}

function ContactItem({
  label,
  value,
  href,
}: {
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-baseline gap-2">
      <p className="text-caption text-muted-foreground min-w-[100px]">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          className="text-body text-primary hover:text-primary/80 font-semibold hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-body text-foreground">{value}</p>
      )}
    </div>
  )
}
