interface StatCardProps {
  label: string;
  value: number | string;
  featured?: boolean;
}

/**
 * Clean stat display card showing key metrics.
 * Used in the dashboard stats grid.
 */
export function StatCard({ label, value, featured = false }: StatCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card shadow-sm p-6 text-center ${
      featured
        ? 'border-t-2 border-t-primary bg-gradient-to-b from-primary/5 to-transparent'
        : 'border-t-2 border-t-primary/30'
    }`}>
      <div className="text-3xl font-serif font-semibold text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-caption text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}
