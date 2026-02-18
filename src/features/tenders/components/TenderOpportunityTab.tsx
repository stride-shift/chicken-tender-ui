import type { TenderDetail } from '@/lib/types'
import { DateDisplay, formatDateTime } from '@/components/shared'

interface TenderOpportunityTabProps {
  tender: TenderDetail
}

function formatEvaluatorNotes(text: string) {
  // Split on lines that start with "- " (common LLM note format)
  const bullets = text.split(/\n?- /).filter(Boolean)

  if (bullets.length <= 1 && !text.includes(': ')) {
    // No bullet structure detected, render as-is with whitespace preserved
    return <p className="text-body text-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
  }

  return (
    <ul className="space-y-3">
      {bullets.map((bullet, i) => {
        const colonIndex = bullet.indexOf(': ')
        if (colonIndex > 0 && colonIndex < 60) {
          // Has a topic label before the colon (and it's not too far in)
          const topic = bullet.slice(0, colonIndex)
          const rest = bullet.slice(colonIndex + 2)
          return (
            <li key={i} className="text-body text-foreground leading-relaxed">
              <strong className="font-semibold">{topic}:</strong> {rest.trim()}
            </li>
          )
        }
        // No colon pattern, render as plain bullet
        return (
          <li key={i} className="text-body text-foreground leading-relaxed">
            {bullet.trim()}
          </li>
        )
      })}
    </ul>
  )
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
          <h3 className="text-subtitle font-semibold text-foreground mb-4">
            Evaluator Notes
          </h3>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-info/10 rounded flex items-center justify-center border border-info/20">
              <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {formatEvaluatorNotes(tender.llm_notes)}
          </div>
        </section>
      )}

      {/* Metadata */}
      <section className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-border">
          <h3 className="text-subtitle font-semibold text-foreground">
            Metadata
          </h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: 'Category', value: tender.category_name },
            { label: 'Department', value: tender.department_name },
            { label: 'Province', value: tender.province_name },
            { label: 'Tender Type', value: tender.tender_type },
            { label: 'Organ of State', value: tender.organ_of_state },
            { label: 'Town', value: tender.town },
            { label: 'E-Submission', value: tender.allows_esubmission ? 'Allowed' : 'Not allowed' },
            ...(tender.delivery_address ? [{ label: 'Delivery Address', value: tender.delivery_address }] : []),
          ].map((item, i) => (
            <div key={i} className={`flex items-baseline px-6 py-2.5 ${i % 2 === 0 ? 'bg-muted/30' : ''}`}>
              <span className="text-caption text-muted-foreground w-36 flex-shrink-0">{item.label}</span>
              <span className="text-body-small text-foreground font-medium">{item.value || '—'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Briefing */}
      <section className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-border">
          <h3 className="text-subtitle font-semibold text-foreground">
            Contact & Briefing
          </h3>
        </div>

        {/* Contact rows */}
        <div className="divide-y divide-border">
          {hasContact ? (
            <>
              {tender.contact_person && (
                <div className="flex items-baseline px-6 py-2.5 bg-muted/30">
                  <span className="text-caption text-muted-foreground w-36 flex-shrink-0">Contact Person</span>
                  <span className="text-body-small text-foreground font-medium">{tender.contact_person}</span>
                </div>
              )}
              {tender.contact_email && (
                <div className="flex items-baseline px-6 py-2.5">
                  <span className="text-caption text-muted-foreground w-36 flex-shrink-0">Email</span>
                  <a href={`mailto:${tender.contact_email}`} className="text-body-small text-accent hover:text-accent/80 font-medium hover:underline">
                    {tender.contact_email}
                  </a>
                </div>
              )}
              {tender.contact_phone && (
                <div className="flex items-baseline px-6 py-2.5 bg-muted/30">
                  <span className="text-caption text-muted-foreground w-36 flex-shrink-0">Phone</span>
                  <a href={`tel:${tender.contact_phone}`} className="text-body-small text-accent hover:text-accent/80 font-medium hover:underline">
                    {tender.contact_phone}
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="px-6 py-3">
              <p className="text-body-small text-muted-foreground">No contact information available.</p>
            </div>
          )}
        </div>

        {/* Briefing */}
        <div className="px-6 py-4 border-t border-border">
          <p className="text-caption font-semibold text-muted-foreground mb-2">Briefing Session</p>
          {hasBriefing ? (
            <div className={`rounded-lg p-3 border ${
              tender.is_briefing_compulsory
                ? 'bg-warning/10 border-warning/30'
                : 'bg-muted border-border'
            }`}>
              {tender.is_briefing_compulsory && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full border border-warning bg-warning/20 px-2.5 py-0.5 text-xs font-semibold text-warning">
                    COMPULSORY
                  </span>
                  <span className="text-caption text-muted-foreground">Attendance required to submit bid</span>
                </div>
              )}
              <div className="space-y-2">
                {tender.briefing_datetime && (
                  <div>
                    <p className="text-caption text-muted-foreground">Date & Time</p>
                    <p className="text-body font-semibold text-foreground mt-0.5 tabular-nums">{formatDateTime(tender.briefing_datetime)}</p>
                    <p className="text-caption text-muted-foreground mt-0.5"><DateDisplay date={tender.briefing_datetime} showRelative /></p>
                  </div>
                )}
                {tender.briefing_venue && (
                  <div>
                    <p className="text-caption text-muted-foreground">Venue</p>
                    <p className="text-body text-foreground mt-0.5 whitespace-pre-wrap">{tender.briefing_venue}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-body-small text-muted-foreground">No briefing session scheduled.</p>
          )}
        </div>
      </section>
    </div>
  )
}

