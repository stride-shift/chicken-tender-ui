import type { TenderDetail } from '@/lib/types'
import { DateDisplay, formatDateTime } from '@/components/shared'

interface TenderDetailContactProps {
  tender: TenderDetail
}

export function TenderDetailContact({ tender }: TenderDetailContactProps) {
  const hasContact = tender.contact_person || tender.contact_email || tender.contact_phone
  const hasBriefing = tender.has_briefing_session

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h3 className="text-subtitle font-serif font-semibold text-foreground mb-4">
          Contact Information
        </h3>

        {hasContact ? (
          <div className="space-y-3">
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
          <p className="text-body text-muted-foreground">No contact information available.</p>
        )}
      </div>

      {/* Briefing Details */}
      {hasBriefing && (
        <div className={`rounded-lg border shadow-sm p-6 ${tender.is_briefing_compulsory ? 'border-warning bg-warning/5' : 'border-border bg-card'}`}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-subtitle font-serif font-semibold text-foreground">
              Briefing Session
            </h3>
            {tender.is_briefing_compulsory && (
              <span className="px-2 py-1 rounded text-caption font-medium bg-warning text-warning-foreground">
                Compulsory
              </span>
            )}
          </div>

          {tender.is_briefing_compulsory && (
            <div className="mb-4 px-3 py-2 rounded-md border border-warning bg-warning/10 text-body-small text-warning-foreground">
              Attendance required to submit bid
            </div>
          )}

          <div className="space-y-3">
            {tender.briefing_datetime && (
              <div>
                <span className="text-caption text-muted-foreground">Date & Time</span>
                <p className="text-body text-foreground font-medium mt-0.5">
                  {formatDateTime(tender.briefing_datetime)}
                </p>
                <p className="text-caption text-muted-foreground mt-0.5">
                  <DateDisplay date={tender.briefing_datetime} showRelative />
                </p>
              </div>
            )}

            {tender.briefing_venue && (
              <div>
                <span className="text-caption text-muted-foreground">Venue</span>
                <p className="text-body text-foreground mt-0.5 whitespace-pre-wrap">
                  {tender.briefing_venue}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h3 className="text-subtitle font-serif font-semibold text-foreground mb-4">
          Additional Details
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-caption text-muted-foreground">
              Published
            </span>
            <p className="text-body text-foreground mt-0.5">
              <DateDisplay date={tender.date_published} />
            </p>
          </div>
          <div>
            <span className="text-caption text-muted-foreground">
              Closing
            </span>
            <p className="text-body text-foreground mt-0.5">
              {formatDateTime(tender.closing_date)}
            </p>
          </div>
          <div>
            <span className="text-caption text-muted-foreground">
              Tender No.
            </span>
            <p className="text-body-small text-foreground mt-0.5 bg-muted px-2 py-1 rounded inline-block">
              {tender.tender_no}
            </p>
          </div>
          <div>
            <span className="text-caption text-muted-foreground">
              Source ID
            </span>
            <p className="text-caption text-muted-foreground mt-0.5 bg-muted px-2 py-1 rounded inline-block">
              {tender.source_tender_id}
            </p>
          </div>
        </div>
      </div>
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
    <div>
      <span className="text-caption text-muted-foreground">{label}</span>
      {href ? (
        <a
          href={href}
          className="text-primary hover:underline font-medium mt-0.5 block"
        >
          {value}
        </a>
      ) : (
        <p className="text-body text-foreground font-medium mt-0.5">{value}</p>
      )}
    </div>
  )
}
