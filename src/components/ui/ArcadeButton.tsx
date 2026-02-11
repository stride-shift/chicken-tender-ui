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

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-8 text-base'
};

// Map animation types to CSS classes for icons
const iconAnimationClasses: Record<IconAnimation, string> = {
  wiggle: 'group-hover:animate-fade-in',
  bounce: 'group-hover:animate-scale-in',
  spin: 'group-hover:animate-fade-in',
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
    iconAnimation = 'none',
    ...props
  }, ref) => {
    const animClass = iconAnimationClasses[iconAnimation];

    return (
      <button
        ref={ref}
        className={`
          group inline-flex items-center justify-center gap-2
          rounded-md font-bold shadow-sm
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        style={style}
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
