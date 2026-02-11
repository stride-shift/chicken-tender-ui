interface AlertCardProps {
  title: string;
  value: number;
  label: string;
  severity: 'high' | 'medium' | 'low';
}

const severityStyles = {
  high: 'border-l-4 border-l-destructive',
  medium: 'border-l-4 border-l-warning',
  low: 'border-l-4 border-l-muted-foreground',
};

const severityTextColors = {
  high: 'text-destructive',
  medium: 'text-warning',
  low: 'text-muted-foreground',
};

/**
 * Alert indicator card for time-sensitive metrics.
 * Shows counts with severity-based border styling.
 */
export function AlertCard({ title, value, label, severity }: AlertCardProps) {
  return (
    <div className={`rounded-lg border bg-card p-4 shadow-sm ${severityStyles[severity]}`}>
      <div className="flex items-center gap-2">
        <span className="text-foreground font-semibold">{title}:</span>
        <span className={`font-semibold ${severityTextColors[severity]}`}>
          {value}
        </span>
        <span className="text-muted-foreground text-xs">in {label}</span>
      </div>
    </div>
  );
}
