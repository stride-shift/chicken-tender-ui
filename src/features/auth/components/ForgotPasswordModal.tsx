import React, { useState } from 'react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

const theme = {
  bg: '#faf8f5',
  bgCard: '#ffffff',
  primary: '#2a9d8f',
  accent: '#e76f51',
  border: '#d4cfc5',
  textMuted: '#6b7c8a',
  text: '#2d3436',
  inputBg: '#ffffff',
};

export function ForgotPasswordModal({ isOpen, onClose, onSubmit }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(email);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: 380,
          background: theme.bgCard,
          border: `4px solid ${theme.primary}`,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top stripe */}
        <div
          style={{
            height: 8,
            background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 12px, ${theme.bg} 12px, ${theme.bg} 24px)`,
          }}
        />

        <div style={{ padding: '32px 32px' }}>
          {/* Header */}
          <h2
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: 14,
              fontWeight: 700,
              color: theme.primary,
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            RESET PASSWORD
          </h2>

          <p
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: 11,
              color: theme.textMuted,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            Enter your email and we'll send you a reset link.
          </p>

          {success ? (
            <div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 11,
                  color: theme.primary,
                  background: '#e6f7f5',
                  border: `3px solid ${theme.primary}`,
                  padding: '16px',
                  textAlign: 'center',
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                Check your email for the reset link!
              </div>
              <ArcadeButton
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleClose}
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 11,
                  width: '100%',
                }}
              >
                CLOSE
              </ArcadeButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Email input */}
              <div>
                <label
                  style={{
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: 9,
                    color: theme.textMuted,
                    display: 'block',
                    marginBottom: 8,
                    letterSpacing: 1,
                    fontWeight: 600,
                  }}
                >
                  EMAIL
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: theme.inputBg,
                    border: `3px solid ${theme.border}`,
                    padding: '0 12px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      fontSize: 12,
                      color: theme.primary,
                      marginRight: 10,
                    }}
                  >
                    @
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      fontSize: 11,
                      color: theme.text,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '14px 0',
                    }}
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: 10,
                    color: '#dc2626',
                    background: '#fef2f2',
                    border: '3px solid #dc2626',
                    padding: '12px',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <ArcadeButton
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleClose}
                  disabled={isLoading}
                  style={{
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: 11,
                    flex: 1,
                  }}
                >
                  CANCEL
                </ArcadeButton>
                <ArcadeButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  style={{
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: 11,
                    flex: 1,
                  }}
                >
                  {isLoading ? 'SENDING...' : 'SEND LINK'}
                </ArcadeButton>
              </div>
            </form>
          )}
        </div>

        {/* Bottom stripe */}
        <div
          style={{
            height: 8,
            background: `repeating-linear-gradient(90deg, ${theme.bg} 0px, ${theme.bg} 12px, ${theme.accent} 12px, ${theme.accent} 24px)`,
          }}
        />
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
