import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [clientCode, setClientCode] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for dev bypass on mount
  useEffect(() => {
    const devClientCode = import.meta.env.VITE_DEV_CLIENT_CODE;

    if (devClientCode) {
      // Dev bypass: auto-authenticate with mock user
      setUser({
        id: 'dev-user-001',
        email: 'dev@tenderrender.local',
      });
      setClientCode(devClientCode);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const login = async (_email: string, _password: string): Promise<void> => {
    setIsLoading(true);

    // Simulate network delay for visual effect
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // STUB: This will be replaced with real Supabase Auth
    // For now, just set mock authenticated state
    setUser({
      id: 'user-001',
      email: _email,
    });
    setClientCode('DEMO'); // Will come from user profile in real implementation
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = (): void => {
    setUser(null);
    setClientCode(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextValue = {
    user,
    clientCode,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
