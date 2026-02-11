interface LEDNumberProps {
  value: string | number;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LEDNumber = ({ value, color: _color = '#2d8f8f', size = 'large' }: LEDNumberProps) => {
  const sizeClasses = {
    large: 'text-5xl',
    medium: 'text-3xl',
    small: 'text-xl'
  };

  return (
    <span
      className={`font-semibold tabular-nums ${sizeClasses[size]} text-foreground`}
    >
      {value}
    </span>
  );
};
