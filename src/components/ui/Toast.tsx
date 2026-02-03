import type { ToastType } from '@/contexts/ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const toastConfig: Record<ToastType, {
  gradient: string;
  innerGradient: string;
  icon: string;
  label: string;
  textColor: string;
  labelColor: string;
}> = {
  success: {
    gradient: 'from-purple-900 via-purple-800 to-purple-900',
    innerGradient: 'from-purple-800 via-purple-700 to-purple-800',
    icon: '🏆',
    label: 'ACHIEVEMENT UNLOCKED',
    textColor: 'text-white',
    labelColor: 'text-purple-300'
  },
  error: {
    gradient: 'from-red-900 via-red-800 to-red-900',
    innerGradient: 'from-red-800 via-red-700 to-red-800',
    icon: '💀',
    label: 'GAME OVER',
    textColor: 'text-white',
    labelColor: 'text-red-300'
  },
  info: {
    gradient: 'from-amber-900 via-amber-800 to-amber-900',
    innerGradient: 'from-amber-800 via-amber-700 to-amber-800',
    icon: '⚠️',
    label: 'ALERT',
    textColor: 'text-white',
    labelColor: 'text-amber-300'
  }
};

export function Toast({ message, type, onDismiss }: ToastProps) {
  const config = toastConfig[type];

  return (
    <div
      className={`bg-gradient-to-r ${config.gradient} p-1 rounded-lg min-w-[300px] max-w-[420px]`}
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
    >
      <div className={`bg-gradient-to-r ${config.innerGradient} p-4 rounded flex items-center gap-3`}>
        <div className="text-2xl">{config.icon}</div>
        <div className="flex-1">
          <div className={`text-xs ${config.labelColor} tracking-widest font-bold`}>
            {config.label}
          </div>
          <div className={`font-black ${config.textColor}`}>{message}</div>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5 text-white/70 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
