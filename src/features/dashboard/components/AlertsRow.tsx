import { useDashboardStats } from '../hooks/useDashboardStats';
import { AlertCard } from './AlertCard';

/**
 * Alert row showing upcoming briefings, closing deadlines, and recent changes.
 * Displays time-sensitive counts with severity-based styling.
 */
export function AlertsRow() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-card shadow-sm px-4 py-2">
        <span className="text-destructive text-sm">
          Error loading alerts: {(error as Error).message}
        </span>
      </div>
    );
  }

  const briefingsCount = stats?.briefings_next_7_days ?? 0;
  const closingCount = stats?.closing_next_7_days ?? 0;
  const recentChangesCount = stats?.high_importance_changes_24h ?? 0;

  return (
    <div className="flex gap-4 text-sm">
      <AlertCard
        title="Briefings"
        value={briefingsCount}
        label="7d"
        severity={briefingsCount > 0 ? 'medium' : 'low'}
      />
      <AlertCard
        title="Closing"
        value={closingCount}
        label="7d"
        severity={closingCount > 0 ? 'high' : 'low'}
      />
      <AlertCard
        title="Changes"
        value={recentChangesCount}
        label="24h"
        severity={recentChangesCount > 0 ? 'medium' : 'low'}
      />
    </div>
  );
}
