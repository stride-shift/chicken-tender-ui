import React, { useState } from 'react';
import CombinedLogo from './CombinedLogo';
import { ArcadeButton } from '@/components/ui/ArcadeButton';

interface LoginCardProps {
  onLogin: (username: string, password: string) => void;
  onForgotPassword?: () => void;
  isLoading: boolean;
}

// Light mode color palette
const theme = {
  bg: '#faf8f5',
  bgCard: '#ffffff',
  primary: '#2a9d8f',
  accent: '#e76f51',
  border: '#d4cfc5',
  textMuted: '#6b7c8a',
  text: '#2d3436',
  cream: '#faf8f5',
  inputBg: '#ffffff',
};

const LoginCard: React.FC<LoginCardProps> = ({ onLogin, onForgotPassword, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div
      style={{
        width: 380,
        background: theme.bgCard,
        border: `4px solid ${theme.primary}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top racing stripe */}
      <div
        style={{
          height: 8,
          background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 12px, ${theme.cream} 12px, ${theme.cream} 24px)`,
        }}
      />

      <div style={{ padding: '40px 32px' }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <CombinedLogo size="xlarge" showPixelBoot={isLoading} />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 9,
            color: theme.textMuted,
            textAlign: 'center',
            marginBottom: 32,
            letterSpacing: 1,
          }}
        >
          AI-POWERED TENDER ANALYSIS
        </div>

        {/* Divider */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, transparent 0%, ${theme.border} 20%, ${theme.border} 80%, transparent 100%)`,
            marginBottom: 28,
          }}
        />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {/* Username */}
          <div>
            <label
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 11,
                color: theme.textMuted,
                display: 'block',
                marginBottom: 8,
                letterSpacing: 1,
              }}
            >
              USERNAME
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: theme.inputBg,
                border: `3px solid ${theme.border}`,
                padding: '0 12px',
                transition: 'border-color 0.2s',
              }}
            >
              <span
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 14,
                  color: theme.primary,
                  marginRight: 10,
                }}
              >
                ▸
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 13,
                  color: theme.text,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '14px 0',
                  letterSpacing: 1,
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 11,
                color: theme.textMuted,
                display: 'block',
                marginBottom: 8,
                letterSpacing: 1,
              }}
            >
              PASSWORD
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
                  fontSize: 14,
                  color: theme.primary,
                  marginRight: 10,
                }}
              >
                ▸
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 13,
                  color: theme.text,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '14px 0',
                  letterSpacing: 1,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 4px',
                  fontSize: 18,
                  color: theme.textMuted,
                  opacity: isLoading ? 0.5 : 1,
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <ArcadeButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: 14,
              marginTop: 8,
              width: '100%',
            }}
          >
            {isLoading ? 'LOGGING IN...' : 'START GAME'}
          </ArcadeButton>

          {/* Forgot password */}
          <div
            style={{
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            <span
              onClick={onForgotPassword}
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 12,
                color: theme.accent,
                cursor: 'pointer',
                letterSpacing: 1,
              }}
            >
              FORGOT PASSWORD?
            </span>
          </div>
        </form>
      </div>

      {/* Bottom racing stripe */}
      <div
        style={{
          height: 8,
          background: `repeating-linear-gradient(90deg, ${theme.cream} 0px, ${theme.cream} 12px, ${theme.accent} 12px, ${theme.accent} 24px)`,
        }}
      />

      {/* Corner decorations - L-shaped accents */}
      {/* Top-left */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: -4,
          width: 16,
          height: 16,
          borderBottom: `4px solid ${theme.accent}`,
          borderLeft: `4px solid ${theme.accent}`,
        }}
      />
      {/* Top-right */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: -4,
          width: 16,
          height: 16,
          borderBottom: `4px solid ${theme.accent}`,
          borderRight: `4px solid ${theme.accent}`,
        }}
      />
      {/* Bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: -4,
          width: 16,
          height: 16,
          borderTop: `4px solid ${theme.accent}`,
          borderLeft: `4px solid ${theme.accent}`,
        }}
      />
      {/* Bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: -4,
          width: 16,
          height: 16,
          borderTop: `4px solid ${theme.accent}`,
          borderRight: `4px solid ${theme.accent}`,
        }}
      />
    </div>
  );
};

export default LoginCard;
