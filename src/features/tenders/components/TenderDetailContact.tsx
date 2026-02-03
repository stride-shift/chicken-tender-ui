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
      <div
        className="bg-white p-5 rounded"
        style={{
          border: '3px solid #2d8f8f',
          boxShadow: '4px 4px 0 #2d8f8f44'
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-teal-500" />
          <span className="text-sm font-black text-teal-700 uppercase tracking-wider">
            CONTACT INFORMATION
          </span>
        </div>

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
          <p className="text-sm text-stone-500">No contact information available.</p>
        )}
      </div>

      {/* Briefing Details */}
      {hasBriefing && (
        <div
          className="bg-white p-5 rounded"
          style={{
            border: tender.is_briefing_compulsory
              ? '3px solid #f59e0b'
              : '3px solid #e7e5e4',
            boxShadow: tender.is_briefing_compulsory
              ? '4px 4px 0 #f59e0b44'
              : '4px 4px 0 #d6d3d144'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 ${tender.is_briefing_compulsory ? 'bg-amber-500' : 'bg-stone-400'}`} />
            <span className={`text-sm font-black uppercase tracking-wider ${tender.is_briefing_compulsory ? 'text-amber-700' : 'text-stone-700'}`}>
              BRIEFING SESSION
            </span>
            {tender.is_briefing_compulsory && (
              <span
                className="px-2 py-1 text-xs font-black text-white rounded ml-2"
                style={{
                  background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)',
                  boxShadow: '0 2px 0 rgba(0,0,0,0.2)'
                }}
              >
                COMPULSORY
              </span>
            )}
          </div>

          {tender.is_briefing_compulsory && (
            <div
              className="mb-4 px-3 py-2 rounded text-sm text-amber-800 bg-amber-50"
              style={{ border: '2px solid #fcd34d' }}
            >
              Attendance required to submit bid
            </div>
          )}

          <div className="space-y-3">
            {tender.briefing_datetime && (
              <div>
                <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">Date & Time</span>
                <p className="text-stone-800 font-medium mt-0.5">
                  {formatDateTime(tender.briefing_datetime)}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  <DateDisplay date={tender.briefing_datetime} showRelative />
                </p>
              </div>
            )}

            {tender.briefing_venue && (
              <div>
                <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">Venue</span>
                <p className="text-stone-700 mt-0.5 whitespace-pre-wrap">
                  {tender.briefing_venue}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div
        className="bg-white p-5 rounded"
        style={{
          border: '3px solid #e7e5e4',
          boxShadow: '4px 4px 0 #d6d3d144'
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-stone-400" />
          <span className="text-sm font-black text-stone-700 uppercase tracking-wider">
            ADDITIONAL DETAILS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">
              Published
            </span>
            <p className="text-stone-800 mt-0.5">
              <DateDisplay date={tender.date_published} />
            </p>
          </div>
          <div>
            <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">
              Closing
            </span>
            <p className="text-stone-800 mt-0.5">
              {formatDateTime(tender.closing_date)}
            </p>
          </div>
          <div>
            <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">
              Tender No.
            </span>
            <p
              className="text-stone-800 mt-0.5 font-mono text-sm bg-stone-50 px-2 py-1 rounded inline-block"
              style={{ boxShadow: 'inset 1px 1px 0 #d6d3d1' }}
            >
              {tender.tender_no}
            </p>
          </div>
          <div>
            <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">
              Source ID
            </span>
            <p
              className="text-stone-600 mt-0.5 font-mono text-xs bg-stone-50 px-2 py-1 rounded inline-block"
              style={{ boxShadow: 'inset 1px 1px 0 #d6d3d1' }}
            >
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
      <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">{label}</span>
      {href ? (
        <a
          href={href}
          className="text-teal-600 font-medium hover:underline mt-0.5 block"
        >
          {value}
        </a>
      ) : (
        <p className="text-stone-800 font-medium mt-0.5">{value}</p>
      )}
    </div>
  )
}
