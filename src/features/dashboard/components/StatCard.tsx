interface StatCardProps {
  label: string;
  value: number | string;
  accentColor?: string;
}

/**
 * Clean stat display card showing key metrics.
 * Used in the dashboard stats grid.
 */
export function StatCard({ label, value, accentColor = '#3b82f6' }: StatCardProps) {
  return (
    <div
      className="rounded-lg border border-border bg-card shadow-sm p-3 text-center"
      style={{ borderTopWidth: '2px', borderTopColor: accentColor }}
    >
      <div className="text-2xl font-sans font-semibold text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-caption text-muted-foreground mt-0.5">
        {label}
      </div>
    </div>
  );
}
