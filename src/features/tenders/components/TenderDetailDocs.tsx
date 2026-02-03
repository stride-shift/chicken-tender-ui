import type { TenderDocument } from '@/lib/types'

interface TenderDetailDocsProps {
  documents: TenderDocument[]
}

export function TenderDetailDocs({ documents }: TenderDetailDocsProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500" />
          <h3 className="text-sm font-black text-teal-700 uppercase tracking-wider">
            DOCUMENTS
          </h3>
        </div>
        <p className="text-sm text-stone-500">No documents available for this tender.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500" />
          <h3 className="text-sm font-black text-teal-700 uppercase tracking-wider">
            DOCUMENTS
          </h3>
        </div>
        <span
          className="px-2 py-1 text-xs font-bold text-stone-600 bg-stone-100 rounded"
          style={{ boxShadow: '0 2px 0 #d6d3d1' }}
        >
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

  const getIconStyle = (extension: string | null): { bg: string; text: string; border: string } => {
    const ext = extension?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
      case 'doc':
      case 'docx':
        return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' }
      case 'xls':
      case 'xlsx':
        return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' }
      default:
        return { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' }
    }
  }

  const iconStyle = getIconStyle(document.file_extension)

  return (
    <div
      className="flex items-center gap-3 p-3 bg-white rounded transition-all hover:translate-x-1"
      style={{
        border: '2px solid #e7e5e4',
        boxShadow: '2px 2px 0 #e7e5e4'
      }}
    >
      {/* File type icon */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center text-xs font-black"
        style={{
          backgroundColor: iconStyle.bg,
          color: iconStyle.text,
          border: `2px solid ${iconStyle.border}`,
          boxShadow: '0 2px 0 rgba(0,0,0,0.05)'
        }}
      >
        {getFileIcon(document.file_extension)}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 truncate" title={document.file_name}>
          {document.file_name}
        </p>
        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
          {document.document_type && (
            <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
              {document.document_type}
            </span>
          )}
          {document.file_size && (
            <span className="font-mono">{formatFileSize(document.file_size)}</span>
          )}
          {document.processing_status !== 'available' && (
            <span
              className="px-1.5 py-0.5 rounded text-amber-700 font-bold"
              style={{
                background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                boxShadow: '0 1px 0 rgba(0,0,0,0.1)'
              }}
            >
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
          className="flex-shrink-0 px-3 py-1.5 text-sm font-black text-white rounded transition-all hover:translate-y-0.5"
          style={{
            background: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 100%)',
            boxShadow: '0 3px 0 #1a5f5f'
          }}
        >
          OPEN
        </a>
      ) : (
        <span
          className="flex-shrink-0 px-3 py-1.5 text-sm text-stone-400 font-bold bg-stone-100 rounded"
          style={{ boxShadow: '0 2px 0 #d6d3d1' }}
        >
          N/A
        </span>
      )}
    </div>
  )
}
