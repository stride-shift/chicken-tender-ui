interface LEDNumberProps {
  value: string | number;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LEDNumber = ({ value, color = '#2d8f8f', size = 'large' }: LEDNumberProps) => {
  const sizeClasses = {
    large: 'text-5xl',
    medium: 'text-3xl',
    small: 'text-xl'
  };

  return (
    <span
      className={`font-black font-mono ${sizeClasses[size]}`}
      style={{
        color: color,
        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        letterSpacing: '0.05em'
      }}
    >
      {value}
    </span>
  );
};
