import type { ToastType } from '@/contexts/ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const toastConfig: Record<ToastType, {
  borderColor: string;
  icon: string;
  label: string;
  textColor: string;
  labelColor: string;
}> = {
  success: {
    borderColor: 'border-l-success',
    icon: '✓',
    label: 'Success',
    textColor: 'text-card-foreground',
    labelColor: 'text-success'
  },
  error: {
    borderColor: 'border-l-destructive',
    icon: '✕',
    label: 'Error',
    textColor: 'text-card-foreground',
    labelColor: 'text-destructive'
  },
  info: {
    borderColor: 'border-l-info',
    icon: 'ℹ',
    label: 'Info',
    textColor: 'text-card-foreground',
    labelColor: 'text-info'
  }
};

export function Toast({ message, type, onDismiss }: ToastProps) {
  const config = toastConfig[type];

  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-lg p-4 min-w-[300px] max-w-[420px] ${config.borderColor} border-l-4`}
    >
      <div className="flex items-center gap-3">
        <div className={`text-lg ${config.labelColor}`}>{config.icon}</div>
        <div className="flex-1">
          <div className={`text-sm font-semibold ${config.labelColor}`}>
            {config.label}
          </div>
          <div className={`text-sm ${config.textColor}`}>{message}</div>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4 text-muted-foreground hover:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
