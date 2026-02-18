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
        <h3 className="text-subtitle font-semibold text-foreground">
          Change History
        </h3>
        <p className="text-body text-muted-foreground">No changes recorded for this tender.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-subtitle font-semibold text-foreground">
          Change History
        </h3>
        <span className="px-2 py-1 text-caption text-muted-foreground bg-muted rounded">
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
        <span className="px-2 py-1 rounded text-caption font-medium bg-accent text-accent-foreground">
          Document
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded text-caption font-medium bg-info text-info-foreground">
        Metadata
      </span>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-card hover:bg-muted transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <ImportanceBadge importance={change.highest_importance} />
          {getChangeTypeBadge()}
          <span className="text-caption text-muted-foreground">
            {formatDateTime(change.observed_at)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption text-muted-foreground">
            {fieldChanges.length + (hasDocChanges ? 1 : 0)} item(s)
          </span>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
        <div className="px-4 py-3 bg-muted border-t border-border space-y-3">
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
                <div className="bg-card p-3 rounded-md border border-success">
                  <div className="text-body-small font-medium text-success mb-1 flex items-center gap-2">
                    <span>+</span> Added
                  </div>
                  <div className="space-y-1">
                    {documents.added.map((doc, idx) => {
                      const { fileName, sourceId } = normalizeDocument(doc)
                      return (
                        <div key={idx} className="text-body-small text-foreground pl-4">
                          <span className="font-medium">{fileName}</span>
                          {sourceId && (
                            <span className="text-caption text-muted-foreground ml-2">ID: {sourceId}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {documents.removed.length > 0 && (
                <div className="bg-card p-3 rounded-md border border-destructive">
                  <div className="text-body-small font-medium text-destructive mb-1 flex items-center gap-2">
                    <span>-</span> Removed
                  </div>
                  <div className="space-y-1">
                    {documents.removed.map((doc, idx) => {
                      const { fileName, sourceId } = normalizeDocument(doc)
                      return (
                        <div key={idx} className="text-body-small text-foreground pl-4">
                          <span className="font-medium">{fileName}</span>
                          {sourceId && (
                            <span className="text-caption text-muted-foreground ml-2">ID: {sourceId}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {documents.modified.length > 0 && (
                <div className="bg-card p-3 rounded-md border border-warning">
                  <div className="text-body-small font-medium text-warning mb-1 flex items-center gap-2">
                    <span>~</span> Modified
                  </div>
                  <div className="space-y-1">
                    {documents.modified.map((doc, idx) => {
                      const { fileName, sourceId } = normalizeDocument(doc)
                      return (
                        <div key={idx} className="text-body-small text-foreground pl-4">
                          <span className="font-medium">{fileName}</span>
                          {sourceId && (
                            <span className="text-caption text-muted-foreground ml-2">ID: {sourceId}</span>
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
    <div className="bg-card p-3 rounded-md border border-border">
      <div className="flex items-center justify-between mb-1">
        <span className="text-body-small font-medium text-foreground">
          {formatFieldName(fieldChange.field)}
        </span>
        <ImportanceBadge importance={fieldChange.importance} size="sm" />
      </div>
      <div className="text-caption flex items-start gap-2">
        <span className="text-destructive line-through bg-destructive/10 px-1 rounded">{formatValue(fieldChange.previous)}</span>
        <span className="text-muted-foreground">→</span>
        <span className="text-success bg-success/10 px-1 rounded font-medium">{formatValue(fieldChange.current)}</span>
      </div>
    </div>
  )
}
