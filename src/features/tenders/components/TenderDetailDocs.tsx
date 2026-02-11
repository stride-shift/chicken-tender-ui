import type { TenderDocument } from '@/lib/types'

interface TenderDetailDocsProps {
  documents: TenderDocument[]
}

export function TenderDetailDocs({ documents }: TenderDetailDocsProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-subtitle font-serif font-semibold text-foreground">
          Documents
        </h3>
        <p className="text-body text-muted-foreground">No documents available for this tender.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-subtitle font-serif font-semibold text-foreground">
          Documents
        </h3>
        <span className="px-2 py-1 text-caption text-muted-foreground bg-muted rounded">
          {documents.length} file(s)
        </span>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <DocumentItem key={doc.document_pk} document={doc} />
        ))}
      </div>
    </div>
  )
}

function DocumentItem({ document }: { document: TenderDocument }) {
  const isAvailable = document.processing_status === 'available' && document.download_url

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (extension: string | null): string => {
    const ext = extension?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return 'PDF'
      case 'doc':
      case 'docx':
        return 'DOC'
      case 'xls':
      case 'xlsx':
        return 'XLS'
      case 'zip':
      case 'rar':
        return 'ZIP'
      default:
        return 'FILE'
    }
  }

  const getIconStyle = (extension: string | null): string => {
    const ext = extension?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'doc':
      case 'docx':
        return 'bg-info/10 text-info border-info/20'
      case 'xls':
      case 'xlsx':
        return 'bg-success/10 text-success border-success/20'
      default:
        return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  const iconStyle = getIconStyle(document.file_extension)

  return (
    <div className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors">
      {/* File type icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded border flex items-center justify-center text-caption font-bold ${iconStyle}`}>
        {getFileIcon(document.file_extension)}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium text-foreground truncate" title={document.file_name}>
          {document.file_name}
        </p>
        <div className="flex items-center gap-2 text-caption text-muted-foreground mt-0.5">
          {document.document_type && (
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground">
              {document.document_type}
            </span>
          )}
          {document.file_size && (
            <span>{formatFileSize(document.file_size)}</span>
          )}
          {document.processing_status !== 'available' && (
            <span className="px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">
              {document.processing_status}
            </span>
          )}
        </div>
      </div>

      {/* Download button */}
      {isAvailable ? (
        <a
          href={document.download_url!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-3 py-1.5 text-body-small text-primary hover:underline font-medium"
        >
          Open
        </a>
      ) : (
        <span className="flex-shrink-0 px-3 py-1.5 text-body-small text-muted-foreground bg-muted rounded">
          N/A
        </span>
      )}
    </div>
  )
}
