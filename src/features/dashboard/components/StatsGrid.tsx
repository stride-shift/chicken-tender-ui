import { PixelBox } from '@/components/ui';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from './StatCard';

// Color-coded stat configurations for arcade scoreboard feel
const statConfigs = [
  { key: 'total_active', label: 'TOTAL ACTIVE', color: '#2d8f8f', bg: '#f0fdfa' },
  { key: 'total_relevant', label: 'RELEVANT', color: '#22c55e', bg: '#f0fdf4' },
  { key: 'total_not_relevant', label: 'NOT RELEVANT', color: '#6b7280', bg: '#f9fafb' },
  { key: 'excellent_count', label: 'EXCELLENT', color: '#f59e0b', bg: '#fffbeb' },
  { key: 'good_count', label: 'GOOD FIT', color: '#3b82f6', bg: '#eff6ff' },
  { key: 'worth_reviewing_count', label: 'REVIEWING', color: '#8b5cf6', bg: '#f5f3ff' },
] as const;

/**
 * Arcade scoreboard-style stats display with LED numbers and pixel styling.
 * Shows key tender metrics in a visually prominent grid.
 */
export function StatsGrid() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <PixelBox color="#2d8f8f" bgColor="#ffffff" className="p-4">
        <div className="grid grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-20 bg-stone-100 animate-pulse"
              style={{
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }}
            />
          ))}
        </div>
      </PixelBox>
    );
  }

  if (error) {
    return (
      <PixelBox color="#dc2626" bgColor="#fef2f2" className="p-4">
        <div className="text-red-600 font-mono">
          <p className="font-bold tracking-widest">ERROR LOADING STATS</p>
          <p className="text-sm mt-1 text-red-500">{(error as Error).message}</p>
        </div>
      </PixelBox>
    );
  }

  return (
    <PixelBox color="#2d8f8f" bgColor="#ffffff" className="p-4">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {statConfigs.map((config) => (
          <StatCard
            key={config.key}
            label={config.label}
            value={stats?.[config.key] ?? 0}
            color={config.color}
            bgColor={config.bg}
          />
        ))}
      </div>
    </PixelBox>
  );
}
