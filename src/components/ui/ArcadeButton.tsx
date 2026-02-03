import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconAnimation = 'wiggle' | 'bounce' | 'spin' | 'none';

interface ArcadeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  /** Icon to display before button text */
  icon?: React.ReactNode;
  /** Icon to display after button text */
  iconRight?: React.ReactNode;
  /** Animation to apply to icons on hover */
  iconAnimation?: IconAnimation;
}

const variantStyles: Record<ButtonVariant, { bg: string; shadow: string; text: string }> = {
  primary: {
    bg: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 50%, #1a5f5f 100%)',
    shadow: '#134e4a',
    text: 'white'
  },
  secondary: {
    bg: 'linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)',
    shadow: '#a8a29e',
    text: '#1a3a4a'
  },
  success: {
    bg: 'linear-gradient(180deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
    shadow: '#166534',
    text: 'white'
  },
  warning: {
    bg: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    shadow: '#92400e',
    text: 'white'
  },
  danger: {
    bg: 'linear-gradient(180deg, #f87171 0%, #ef4444 50%, #dc2626 100%)',
    shadow: '#991b1b',
    text: 'white'
  }
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg'
};

// Map animation types to CSS classes for icons
const iconAnimationClasses: Record<IconAnimation, string> = {
  wiggle: 'group-hover:animate-arcade-wiggle',
  bounce: 'group-hover:animate-arcade-bounce',
  spin: 'group-hover:animate-arcade-spin',
  none: ''
};

export const ArcadeButton = forwardRef<HTMLButtonElement, ArcadeButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    style,
    icon,
    iconRight,
    iconAnimation = 'wiggle',
    ...props
  }, ref) => {
    const styles = variantStyles[variant];
    const animClass = iconAnimationClasses[iconAnimation];

    return (
      <button
        ref={ref}
        className={`
          group font-black tracking-wider transition-all
          hover:translate-y-0.5 active:translate-y-1
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
          flex items-center justify-center gap-2
          ${sizeStyles[size]} ${className}
        `}
        style={{
          background: styles.bg,
          color: styles.text,
          boxShadow: `0 4px 0 ${styles.shadow}, inset 0 2px 0 rgba(255,255,255,0.3)`,
          borderRadius: '6px',
          ...style
        }}
        {...props}
      >
        {icon && (
          <span className={`inline-flex transition-transform duration-200 ${animClass}`}>
            {icon}
          </span>
        )}
        <span>{children}</span>
        {iconRight && (
          <span className={`inline-flex transition-transform duration-200 ${animClass}`}>
            {iconRight}
          </span>
        )}
      </button>
    );
  }
);

ArcadeButton.displayName = 'ArcadeButton';
