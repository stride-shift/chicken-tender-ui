interface HealthBarProps {
  current: number;
  max: number;
  color?: string;
  segments?: number;
  showLabel?: boolean;
  variant?: 'dark' | 'light';
}

export const HealthBar = ({
  current,
  max,
  color: _color = '#22c55e',
  segments: _segments = 20,
  showLabel = false,
  variant: _variant = 'light'
}: HealthBarProps) => {
  const percentage = (current / max) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted-foreground/20">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-semibold tabular-nums text-sm text-foreground">
          {Math.round(current)}/{max}
        </span>
      )}
    </div>
  );
};
