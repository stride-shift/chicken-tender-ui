import { PixelBox } from '@/components/ui';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { AlertCard } from './AlertCard';

/**
 * LED-style alert row showing upcoming briefings, closing deadlines, and recent changes.
 * Displays time-sensitive counts with arcade glow effects.
 */
export function AlertsRow() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="h-12 bg-stone-100 rounded animate-pulse" />
    );
  }

  if (error) {
    return (
      <PixelBox color="#dc2626" bgColor="#fef2f2" className="px-4 py-2">
        <span className="text-red-600 font-mono text-sm">
          Error loading alerts: {(error as Error).message}
        </span>
      </PixelBox>
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
        urgent={briefingsCount > 0}
        color="#2dd4bf"
      />
      <AlertCard
        title="Closing"
        value={closingCount}
        label="7d"
        urgent={closingCount > 0}
        color="#fbbf24"
      />
      <AlertCard
        title="Changes"
        value={recentChangesCount}
        label="24h"
        urgent={recentChangesCount > 0}
        color="#c084fc"
      />
    </div>
  );
}
