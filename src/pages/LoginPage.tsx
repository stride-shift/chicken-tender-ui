import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import LoginCard from '@/features/auth/components/LoginCard';
import { ForgotPasswordModal } from '@/features/auth/components/ForgotPasswordModal';

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-4">
      <LoginCard
        onLogin={handleLogin}
        onForgotPassword={() => setShowForgotPassword(true)}
        isLoading={isLoading}
      />
      {error && (
        <div className="w-full max-w-md rounded-md bg-destructive/10 border border-destructive p-3">
          <p className="text-sm text-destructive text-center">
            {error}
          </p>
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
