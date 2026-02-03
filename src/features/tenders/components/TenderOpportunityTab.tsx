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
      {/* AI Summary */}
      {tender.final_report_text && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-teal-500" />
            <span className="text-sm font-black text-teal-700 uppercase tracking-wider">
              AI SUMMARY
            </span>
          </div>
          <div
            className="bg-white p-4 rounded"
            style={{
              border: '2px solid #e7e5e4',
              boxShadow: '3px 3px 0 #d6d3d1'
            }}
          >
            <FormattedSummary content={tender.final_report_text} />
          </div>
        </section>
      )}

      {/* Description */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-orange-500" />
          <span className="text-sm font-black text-orange-700 uppercase tracking-wider">
            DESCRIPTION
          </span>
        </div>
        <div
          className="bg-white p-4 rounded"
          style={{
            border: '2px solid #e7e5e4',
            boxShadow: '3px 3px 0 #d6d3d1'
          }}
        >
          <div className="prose prose-stone max-w-none">
            <Markdown content={tender.description} />
          </div>
        </div>
      </section>

      {/* Metadata */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-blue-500" />
          <span className="text-sm font-black text-blue-700 uppercase tracking-wider">
            METADATA
          </span>
        </div>
        <div
          className="bg-white p-4 rounded"
          style={{
            border: '2px solid #e7e5e4',
            boxShadow: '3px 3px 0 #d6d3d1'
          }}
        >
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
        </div>
      </section>

      {/* Contact & Briefing */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-purple-500" />
          <span className="text-sm font-black text-purple-700 uppercase tracking-wider">
            CONTACT & BRIEFING
          </span>
        </div>
        <div
          className="bg-white p-4 rounded space-y-4"
          style={{
            border: '2px solid #e7e5e4',
            boxShadow: '3px 3px 0 #d6d3d1'
          }}
        >
          {/* Contact Information */}
          <div>
            <p className="text-sm font-bold text-stone-800 mb-2 uppercase tracking-wide">
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
              <p className="text-sm text-stone-500">
                No contact information available.
              </p>
            )}
          </div>

          {/* Briefing Session */}
          {hasBriefing && (
            <div className="pt-4 border-t-2 border-stone-200">
              <p className="text-sm font-bold text-stone-800 mb-2 uppercase tracking-wide">
                Briefing Session
              </p>
              <div
                className="rounded p-3"
                style={{
                  backgroundColor: tender.is_briefing_compulsory ? '#fef3c7' : '#f5f5f4',
                  border: tender.is_briefing_compulsory
                    ? '2px solid #fbbf24'
                    : '2px solid #d6d3d1',
                  boxShadow: '2px 2px 0 ' + (tender.is_briefing_compulsory ? '#f59e0b' : '#a8a29e')
                }}
              >
                {tender.is_briefing_compulsory && (
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-black uppercase tracking-wide text-amber-800 px-2 py-0.5"
                      style={{
                        backgroundColor: '#fde68a',
                        border: '2px solid #f59e0b'
                      }}
                    >
                      COMPULSORY
                    </span>
                    <span className="text-xs text-amber-700 font-medium">
                      Attendance required to submit bid
                    </span>
                  </div>
                )}
                <div className="space-y-2">
                  {tender.briefing_datetime && (
                    <div>
                      <p className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                        Date & Time
                      </p>
                      <p className="text-sm font-bold text-stone-800 mt-0.5">
                        {formatDateTime(tender.briefing_datetime)}
                      </p>
                      <p className="text-xs text-stone-600 mt-0.5">
                        <DateDisplay date={tender.briefing_datetime} showRelative />
                      </p>
                    </div>
                  )}
                  {tender.briefing_venue && (
                    <div>
                      <p className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                        Venue
                      </p>
                      <p className="text-sm text-stone-700 mt-0.5 whitespace-pre-wrap">
                        {tender.briefing_venue}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!hasBriefing && (
            <div className="pt-4 border-t-2 border-stone-200">
              <p className="text-sm font-bold text-stone-800 mb-2 uppercase tracking-wide">
                Briefing Session
              </p>
              <p className="text-sm text-stone-500">No briefing session scheduled.</p>
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
      <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-stone-700 mt-0.5 font-medium">{value || '-'}</p>
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
      <p className="text-xs font-bold text-stone-500 uppercase tracking-wide min-w-[100px]">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          className="text-sm text-teal-600 hover:text-teal-700 font-bold hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm text-stone-700 font-medium">{value}</p>
      )}
    </div>
  )
}
