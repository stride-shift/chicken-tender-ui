import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import LoginCard from '@/features/auth/components/LoginCard';

// Light mode color palette
const theme = {
  bg: '#faf8f5',
};

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        // Call auth login (has built-in delay ~2 seconds)
        await auth.login(username, password);

        // Navigate to dashboard
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
        setIsLoading(false);
      }
    },
    [auth, isLoading, navigate]
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <LoginCard onLogin={handleLogin} isLoading={isLoading} />
    </div>
  );
}

export default LoginPage;
