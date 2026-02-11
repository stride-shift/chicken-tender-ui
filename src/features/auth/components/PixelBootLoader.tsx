type PixelBootLoaderSize = 'small' | 'medium' | 'large';

interface PixelBootLoaderProps {
  size?: PixelBootLoaderSize;
  color?: string;
}

const SIZE_CONFIG: Record<PixelBootLoaderSize, { spinnerSize: string; logoSize: string }> = {
  small: { spinnerSize: 'h-8 w-8', logoSize: 'text-xl' },
  medium: { spinnerSize: 'h-12 w-12', logoSize: 'text-2xl' },
  large: { spinnerSize: 'h-16 w-16', logoSize: 'text-3xl' },
};

export function PixelBootLoader({
  size = 'medium',
  color = 'hsl(45, 93%, 58%)',
}: PixelBootLoaderProps) {
  const { spinnerSize, logoSize } = SIZE_CONFIG[size];

  return (
    <div
      className="inline-flex flex-col items-center justify-center gap-6"
      role="status"
      aria-label="Loading"
    >
      {/* Spinner */}
      <div
        className={`${spinnerSize} border-4 border-border border-t-primary rounded-full animate-spin`}
        style={{ borderTopColor: color }}
      />

      {/* App name */}
      <div className="text-center">
        <h2 className={`font-serif font-semibold ${logoSize} text-foreground animate-pulse`}>
          TenderRender
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default PixelBootLoader;
