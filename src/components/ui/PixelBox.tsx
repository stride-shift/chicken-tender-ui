interface PixelBoxProps {
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  className?: string;
}

export const PixelBox = ({
  children,
  className = ''
}: PixelBoxProps) => {
  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};
