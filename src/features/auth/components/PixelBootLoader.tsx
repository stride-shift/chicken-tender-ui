import { useState, useEffect, useCallback } from 'react';

type PixelBootLoaderSize = 'small' | 'medium' | 'large';

interface PixelBootLoaderProps {
  size?: PixelBootLoaderSize;
  color?: string;
}

// 10x10 pixel grid forming a circle with inner dot
const PIXEL_GRID = [
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
];

const TOTAL_PIXELS = PIXEL_GRID.flat().filter((p) => p === 1).length;
const ANIMATION_FRAMES = 40; // Number of frames for one complete cycle

const SIZE_CONFIG: Record<PixelBootLoaderSize, { pixelSize: number; gap: number }> = {
  small: { pixelSize: 3, gap: 1 },
  medium: { pixelSize: 5, gap: 1 },
  large: { pixelSize: 7, gap: 1 },
};

export function PixelBootLoader({
  size = 'medium',
  color = '#2a9d8f',
}: PixelBootLoaderProps) {
  const [frame, setFrame] = useState(0);

  const animate = useCallback(() => {
    setFrame((prevFrame) => (prevFrame + 1) % ANIMATION_FRAMES);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(animate, 80);
    return () => clearInterval(intervalId);
  }, [animate]);

  const { pixelSize, gap } = SIZE_CONFIG[size];
  const revealProgress = frame / ANIMATION_FRAMES;
  const visiblePixels = Math.floor(revealProgress * TOTAL_PIXELS);

  let pixelCount = 0;

  return (
    <div
      className="inline-flex items-center justify-center"
      style={{
        backgroundColor: '#faf8f5',
        padding: pixelSize,
        borderRadius: 2,
      }}
      role="status"
      aria-label="Loading"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(10, ${pixelSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {PIXEL_GRID.flat().map((pixel, index) => {
          if (pixel === 1) {
            pixelCount++;
          }
          const isVisible = pixel === 1 && pixelCount <= visiblePixels;

          return (
            <div
              key={index}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: isVisible ? color : `${color}20`,
                transition: 'background-color 0.05s ease',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PixelBootLoader;
