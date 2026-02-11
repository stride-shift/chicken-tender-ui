import { useDashboardStats } from '../hooks/useDashboardStats'

/**
 * Displays a preview of recent high-importance changes.
 * Currently shows just the count; will integrate with activity feed in the future.
 */
export function RecentChanges() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-3 bg-muted border-b border-border">
          <h3 className="font-serif font-semibold text-foreground">Recent Changes</h3>
        </div>
        {/* Loading state */}
        <div className="p-4">
          <div className="h-6 w-48 bg-muted rounded animate-pulse mb-3" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-3 bg-muted border-b border-border">
          <h3 className="font-serif font-semibold text-foreground">Recent Changes</h3>
        </div>
        {/* Error state */}
        <div className="p-4">
          <span className="text-destructive font-semibold">Error:</span>
          <span className="text-muted-foreground ml-2">{(error as Error).message}</span>
        </div>
      </div>
    )
  }

  const changesCount = stats?.high_importance_changes_24h ?? 0

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-muted border-b border-border">
        <h3 className="font-serif font-semibold text-foreground">Recent Changes</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="border-b border-border py-3 last:border-0">
          {changesCount > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">24H</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-warning/10 text-warning border border-warning/20">
                ALERT
              </span>
              <div className="flex items-center gap-2">
                <span className="text-h3 font-serif font-semibold text-warning">{changesCount}</span>
                <span className="text-foreground text-sm">
                  high-importance {changesCount === 1 ? 'change' : 'changes'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">24H</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-success/10 text-success border border-success/20">
                OK
              </span>
              <span className="text-muted-foreground text-sm">
                No high-importance changes
              </span>
            </div>
          )}
        </div>

        {/* Status line */}
        <div className="mt-3 text-caption text-muted-foreground flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Activity feed integration coming soon</span>
        </div>
      </div>
    </div>
  )
}
