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
  color = '#22c55e',
  segments = 20,
  showLabel = false,
  variant = 'light'
}: HealthBarProps) => {
  const filled = Math.round((current / max) * segments);
  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-6 flex-1 p-1 flex gap-0.5 rounded ${isLight ? 'bg-stone-200' : 'bg-stone-800'}`}
        style={{ boxShadow: isLight ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
      >
        {Array(segments).fill(0).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full rounded-sm transition-colors"
            style={{
              backgroundColor: i < filled ? color : (isLight ? '#d6d3d1' : '#374151'),
              boxShadow: i < filled ? `inset 0 -2px 0 rgba(0,0,0,0.2)` : 'none'
            }}
          />
        ))}
      </div>
      {showLabel && (
        <span className={`font-mono font-bold text-sm ${isLight ? 'text-stone-700' : ''}`} style={isLight ? {} : { color }}>
          {Math.round(current)}/{max}
        </span>
      )}
    </div>
  );
};
