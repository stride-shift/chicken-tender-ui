interface ScanlinesProps {
  opacity?: number;
}

export const Scanlines = ({ opacity = 0.03 }: ScanlinesProps) => (
  <div
    className="absolute inset-0 pointer-events-none z-10"
    style={{
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,${opacity}) 2px,
        rgba(0,0,0,${opacity}) 4px
      )`,
    }}
  />
);
