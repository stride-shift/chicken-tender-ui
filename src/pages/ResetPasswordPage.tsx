import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import CombinedLogo from '@/features/auth/components/CombinedLogo';

const theme = {
  bg: '#faf8f5',
  bgCard: '#ffffff',
  primary: '#2a9d8f',
  accent: '#e76f51',
  border: '#d4cfc5',
  textMuted: '#6b7c8a',
  text: '#2d3436',
  inputBg: '#ffffff',
  cream: '#faf8f5',
};

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, isAuthenticated, isLoading: authLoading } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Supabase auto-authenticates via the magic link URL params
  // Wait for auth to complete before showing the form
  useEffect(() => {
    // If already authenticated and we have a hash with access_token, the reset is ready
    // Supabase handles the token exchange automatically
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  // Show loading while auth state is being determined
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: theme.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CombinedLogo size="large" showPixelBoot={true} />
      </div>
    );
  }

  // If not authenticated, the link may be invalid or expired
  if (!isAuthenticated && !authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            width: 380,
            background: theme.bgCard,
            border: `4px solid ${theme.accent}`,
            position: 'relative',
          }}
        >
          <div
            style={{
              height: 8,
              background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 12px, ${theme.cream} 12px, ${theme.cream} 24px)`,
            }}
          />
          <div style={{ padding: '32px' }}>
            <h2
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 14,
                fontWeight: 700,
                color: theme.accent,
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              LINK EXPIRED
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
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <ArcadeButton
              type="button"
              variant="primary"
              size="lg"
              onClick={handleGoToLogin}
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 11,
                width: '100%',
              }}
            >
              BACK TO LOGIN
            </ArcadeButton>
          </div>
          <div
            style={{
              height: 8,
              background: `repeating-linear-gradient(90deg, ${theme.cream} 0px, ${theme.cream} 12px, ${theme.accent} 12px, ${theme.accent} 24px)`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: 380,
          background: theme.bgCard,
          border: `4px solid ${theme.primary}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top stripe */}
        <div
          style={{
            height: 8,
            background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 12px, ${theme.cream} 12px, ${theme.cream} 24px)`,
          }}
        />

        <div style={{ padding: '32px' }}>
          {/* Logo */}
          <div style={{ marginBottom: 24 }}>
            <CombinedLogo size="large" />
          </div>

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
            SET NEW PASSWORD
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
            Enter your new password below.
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
                Password updated successfully!
              </div>
              <ArcadeButton
                type="button"
                variant="primary"
                size="lg"
                onClick={handleGoToLogin}
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 11,
                  width: '100%',
                }}
              >
                GO TO LOGIN
              </ArcadeButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* New Password */}
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
                  NEW PASSWORD
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
                    *
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: theme.textMuted,
                      padding: '4px',
                    }}
                  >
                    {showPassword ? '◉' : '○'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
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
                  CONFIRM PASSWORD
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
                    *
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
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

              {/* Submit button */}
              <ArcadeButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 11,
                  marginTop: 8,
                  width: '100%',
                }}
              >
                {isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </ArcadeButton>
            </form>
          )}
        </div>

        {/* Bottom stripe */}
        <div
          style={{
            height: 8,
            background: `repeating-linear-gradient(90deg, ${theme.cream} 0px, ${theme.cream} 12px, ${theme.accent} 12px, ${theme.accent} 24px)`,
          }}
        />
      </div>
    </div>
  );
}

export default ResetPasswordPage;
