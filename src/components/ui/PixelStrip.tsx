interface PixelStripProps {
  colors?: string[];
  segments?: number;
}

export const PixelStrip = ({
  colors = ['#c75d32', '#e8e4dc', '#2d8f8f', '#e8e4dc'],
  segments = 60
}: PixelStripProps) => (
  <div className="h-2 flex">
    {Array(segments).fill(0).map((_, i) => (
      <div
        key={i}
        className="flex-1 h-full"
        style={{ backgroundColor: colors[i % colors.length] }}
      />
    ))}
  </div>
);
