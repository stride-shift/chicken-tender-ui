interface AlertCardProps {
  title: string;
  value: number;
  label: string;
  urgent: boolean;
  color: string;
}

/**
 * LED-style alert indicator for time-sensitive metrics.
 * Shows glowing numbers on dark background with urgency styling.
 */
export function AlertCard({ title, value, label, urgent, color }: AlertCardProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 bg-white rounded border-2"
      style={{ borderColor: urgent ? color : '#e5e5e5' }}
    >
      <span className="text-stone-600 font-medium">{title}:</span>
      <span
        className="font-mono font-black"
        style={{
          color: urgent ? color : '#6b7280',
        }}
      >
        {value}
      </span>
      <span className="text-stone-500 text-xs">in {label}</span>
    </div>
  );
}
