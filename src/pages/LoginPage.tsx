import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import LoginCard from '@/features/auth/components/LoginCard';
import { ForgotPasswordModal } from '@/features/auth/components/ForgotPasswordModal';

// Light mode color palette
const theme = {
  bg: '#faf8f5',
};

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        await auth.login(username, password);
        navigate('/');
      } catch (err) {
        console.error('Login failed:', err);
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        setIsLoading(false);
      }
    },
    [auth, isLoading, navigate]
  );

  const handleForgotPassword = useCallback(
    async (email: string) => {
      await auth.forgotPassword(email);
    },
    [auth]
  );

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
        gap: 16,
      }}
    >
      <LoginCard
        onLogin={handleLogin}
        onForgotPassword={() => setShowForgotPassword(true)}
        isLoading={isLoading}
      />
      {error && (
        <div
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 11,
            color: '#dc2626',
            background: '#fef2f2',
            border: '3px solid #dc2626',
            padding: '12px 16px',
            maxWidth: 380,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          {error}
        </div>
      )}

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPassword}
      />
    </div>
  );
}

export default LoginPage;
