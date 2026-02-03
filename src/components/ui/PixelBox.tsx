interface PixelBoxProps {
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  className?: string;
}

export const PixelBox = ({
  children,
  color = '#2d8f8f',
  bgColor = '#ffffff',
  className = ''
}: PixelBoxProps) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundColor: bgColor,
        boxShadow: `
          4px 0 0 ${color},
          -4px 0 0 ${color},
          0 4px 0 ${color},
          0 -4px 0 ${color},
          6px 6px 0 ${color}44
        `,
        margin: '4px'
      }}
    >
      {/* Pixel corners */}
      <div className="absolute -top-1 -left-1 w-2 h-2" style={{ backgroundColor: color }} />
      <div className="absolute -top-1 -right-1 w-2 h-2" style={{ backgroundColor: color }} />
      <div className="absolute -bottom-1 -left-1 w-2 h-2" style={{ backgroundColor: color }} />
      <div className="absolute -bottom-1 -right-1 w-2 h-2" style={{ backgroundColor: color }} />
      {children}
    </div>
  );
};
