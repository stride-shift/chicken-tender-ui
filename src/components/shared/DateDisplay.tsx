interface DateDisplayProps {
  date: string
  showRelative?: boolean
  className?: string
}

export function DateDisplay({ date, showRelative = false, className = '' }: DateDisplayProps) {
  const dateObj = new Date(date)
  const now = new Date()

  // Calculate days difference
  const diffTime = dateObj.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Format the absolute date
  const formattedDate = dateObj.toLocaleDateString('en-ZA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Urgent countdown style for closing dates within 7 days
  if (showRelative && diffDays > 0 && diffDays <= 7) {
    // Critical urgency (1-3 days)
    if (diffDays <= 3) {
      return (
        <div
          className={`bg-muted px-3 py-2 rounded-md inline-flex items-center gap-2 ${className}`}
          title={formattedDate}
        >
          <span className="text-sm font-semibold text-destructive">
            {diffDays}d
          </span>
          <span className="text-body-small text-muted-foreground">left</span>
        </div>
      )
    }

    // Moderate urgency (4-7 days)
    return (
      <div
        className={`bg-muted px-3 py-2 rounded-md inline-flex items-center gap-2 ${className}`}
        title={formattedDate}
      >
        <span className="text-sm font-semibold text-warning">
          {diffDays}d
        </span>
        <span className="text-body-small text-muted-foreground">left</span>
      </div>
    )
  }

  // Relative display for today/tomorrow
  if (showRelative) {
    if (diffDays === 0) {
      return (
        <div
          className={`bg-muted px-3 py-2 rounded-md inline-flex items-center gap-2 ${className}`}
          title={formattedDate}
        >
          <span className="text-sm font-semibold text-destructive animate-pulse">
            TODAY
          </span>
        </div>
      )
    }

    if (diffDays === 1) {
      return (
        <div
          className={`bg-muted px-3 py-2 rounded-md inline-flex items-center gap-2 ${className}`}
          title={formattedDate}
        >
          <span className="text-sm font-semibold text-accent">
            TOMORROW
          </span>
        </div>
      )
    }

    // Past dates
    if (diffDays < 0) {
      return (
        <span className={`text-body-small text-muted-foreground ${className}`} title={formattedDate}>
          {Math.abs(diffDays)}d ago
        </span>
      )
    }
  }

  // Normal date display
  return (
    <span className={`text-body-small text-muted-foreground ${className}`}>
      {formattedDate}
    </span>
  )
}

// Helper function to format datetime (includes time)
export function formatDateTime(date: string): string {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-ZA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Helper function to get days until a date
export function getDaysUntil(date: string): number {
  const dateObj = new Date(date)
  const now = new Date()
  const diffTime = dateObj.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
