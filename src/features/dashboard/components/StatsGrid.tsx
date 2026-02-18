import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from './StatCard';

// Stat configurations for dashboard metrics
const statConfigs = [
  { key: 'total_active', label: 'Total Active', color: '#3b82f6' },      // blue
  { key: 'total_relevant', label: 'Relevant', color: '#22c55e' },        // green
  { key: 'total_not_relevant', label: 'Not Relevant', color: '#94a3b8' },// slate gray
  { key: 'excellent_count', label: 'Excellent', color: '#10b981' },      // emerald
  { key: 'good_count', label: 'Good Fit', color: '#0ea5e9' },            // sky blue
  { key: 'worth_reviewing_count', label: 'Reviewing', color: '#f59e0b' },// amber
] as const;

/**
 * Dashboard stats display showing key tender metrics in a clean grid.
 */
export function StatsGrid() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-4">
        <div className="grid grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-16 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-card shadow-sm p-4">
        <div className="text-destructive">
          <p className="font-semibold">Error Loading Stats</p>
          <p className="text-sm mt-1 text-muted-foreground">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-4">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {statConfigs.map((config) => (
          <StatCard
            key={config.key}
            label={config.label}
            value={stats?.[config.key] ?? 0}
            accentColor={config.color}
          />
        ))}
      </div>
    </div>
  );
}
