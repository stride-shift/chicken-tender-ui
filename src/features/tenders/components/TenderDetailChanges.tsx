import { useState } from 'react'
import type { TenderChange, FieldChange, DocumentChange } from '@/lib/types'
import { ImportanceBadge, formatDateTime } from '@/components/shared'

interface TenderDetailChangesProps {
  changes: TenderChange[]
}

export function TenderDetailChanges({ changes }: TenderDetailChangesProps) {
  if (!changes || changes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500" />
          <h3 className="text-sm font-black text-teal-700 uppercase tracking-wider">
            CHANGE HISTORY
          </h3>
        </div>
        <p className="text-sm text-stone-500">No changes recorded for this tender.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500" />
          <h3 className="text-sm font-black text-teal-700 uppercase tracking-wider">
            CHANGE HISTORY
          </h3>
        </div>
        <span
          className="px-2 py-1 text-xs font-bold text-stone-600 bg-stone-100 rounded"
          style={{ boxShadow: '0 2px 0 #d6d3d1' }}
        >
          {changes.length} change(s)
        </span>
      </div>

      <div className="space-y-3">
        {changes.map((change) => (
          <ChangeItem key={change.change_pk} change={change} />
        ))}
      </div>
    </div>
  )
}

function ChangeItem({ change }: { change: TenderChange }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const { changes_json } = change
  const fieldChanges = changes_json?.changes || []
  const rawDocs = changes_json?.documents || {}
  const documents = {
    added: rawDocs.added || [],
    removed: rawDocs.removed || [],
    modified: rawDocs.modified || [],
  }
  const hasDocChanges =
    documents.added.length > 0 || documents.removed.length > 0 || documents.modified.length > 0

  const normalizeDocument = (doc: string | DocumentChange): { fileName: string; sourceId?: string } => {
    if (typeof doc === 'string') {
      return { fileName: doc }
    }
    return {
      fileName: doc.file_name,
      sourceId: doc.source_document_id
    }
  }

  const getChangeTypeBadge = () => {
    if (change.change_type === 'document') {
      return (
        <span
          className="text-xs font-black px-2 py-1 text-white rounded"
          style={{
            background: 'linear-gradient(180deg, #c084fc 0%, #a855f7 100%)',
            boxShadow: '0 2px 0 rgba(0,0,0,0.2)'
          }}
        >
          DOCUMENT
        </span>
      )
    }
    return (
      <span
        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded"
        style={{ boxShadow: '0 2px 0 #dbeafe' }}
      >
        METADATA
      </span>
    )
  }

  return (
    <div
      className="bg-white rounded overflow-hidden"
      style={{
        border: '2px solid #e7e5e4',
        boxShadow: '3px 3px 0 #d6d3d1'
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-stone-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <ImportanceBadge importance={change.highest_importance} />
          {getChangeTypeBadge()}
          <span className="text-stone-500 text-sm font-mono">
            {formatDateTime(change.observed_at)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium">
            {fieldChanges.length + (hasDocChanges ? 1 : 0)} item(s)
          </span>
          <svg
            className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 py-3 bg-stone-50 border-t-2 border-stone-200 space-y-3">
          {/* Field changes */}
          {fieldChanges.length > 0 && (
            <div className="space-y-2">
              {fieldChanges.map((fc, idx) => (
                <FieldChangeItem key={idx} fieldChange={fc} />
              ))}
            </div>
          )}

          {/* Document changes */}
          {hasDocChanges && (
            <div className="space-y-2">
              {documents.added.length > 0 && (
                <div
                  className="bg-white p-3 rounded"
                  style={{
                    border: '2px solid #86efac',
                    boxShadow: '2px 2px 0 #bbf7d0'
                  }}
                >
                  <div className="text-sm font-bold text-green-700 mb-1 flex items-center gap-2">
                    <span className="text-green-500">+</span> Added
                  </div>
                  <div className="space-y-1">
                    {documents.added.map((doc, idx) => {
                      const { fileName, sourceId } = normalizeDocument(doc)
                      return (
                        <div key={idx} className="text-sm text-stone-700 pl-4">
                          <span className="font-medium">{fileName}</span>
                          {sourceId && (
                            <span className="text-xs text-stone-400 ml-2 font-mono">ID: {sourceId}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {documents.removed.length > 0 && (
                <div
                  className="bg-white p-3 rounded"
                  style={{
                    border: '2px solid #fca5a5',
                    boxShadow: '2px 2px 0 #fecaca'
                  }}
                >
                  <div className="text-sm font-bold text-red-700 mb-1 flex items-center gap-2">
                    <span className="text-red-500">-</span> Removed
                  </div>
                  <div className="space-y-1">
                    {documents.removed.map((doc, idx) => {
                      const { fileName, sourceId } = normalizeDocument(doc)
                      return (
                        <div key={idx} className="text-sm text-stone-700 pl-4">
                          <span className="font-medium">{fileName}</span>
                          {sourceId && (
                            <span className="text-xs text-stone-400 ml-2 font-mono">ID: {sourceId}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {documents.modified.length > 0 && (
                <div
                  className="bg-white p-3 rounded"
                  style={{
                    border: '2px solid #fcd34d',
                    boxShadow: '2px 2px 0 #fde68a'
                  }}
                >
                  <div className="text-sm font-bold text-amber-700 mb-1 flex items-center gap-2">
                    <span className="text-amber-500">~</span> Modified
                  </div>
                  <div className="space-y-1">
                    {documents.modified.map((doc, idx) => {
                      const { fileName, sourceId } = normalizeDocument(doc)
                      return (
                        <div key={idx} className="text-sm text-stone-700 pl-4">
                          <span className="font-medium">{fileName}</span>
                          {sourceId && (
                            <span className="text-xs text-stone-400 ml-2 font-mono">ID: {sourceId}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FieldChangeItem({ fieldChange }: { fieldChange: FieldChange }) {
  const formatFieldName = (field: string): string => {
    return field
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatValue = (value: string | null): string => {
    if (value === null || value === '') return '(empty)'
    if (value.length > 100) return value.substring(0, 100) + '...'
    return value
  }

  return (
    <div
      className="bg-white p-3 rounded"
      style={{
        border: '2px solid #e7e5e4',
        boxShadow: '2px 2px 0 #f5f5f4'
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-bold text-stone-800">
          {formatFieldName(fieldChange.field)}
        </span>
        <ImportanceBadge importance={fieldChange.importance} size="sm" />
      </div>
      <div className="text-xs flex items-start gap-2">
        <span className="text-red-600 line-through bg-red-50 px-1 rounded">{formatValue(fieldChange.previous)}</span>
        <span className="text-stone-400 font-bold">-&gt;</span>
        <span className="text-green-700 bg-green-50 px-1 rounded font-medium">{formatValue(fieldChange.current)}</span>
      </div>
    </div>
  )
}
