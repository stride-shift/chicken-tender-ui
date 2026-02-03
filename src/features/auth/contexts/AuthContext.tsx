import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { AuthContextValue, UserProfile, Client } from '../types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'tenderrender_active_client';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [clientCode, setClientCode] = useState<string | null>(null);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [isStrideShift, setIsStrideShift] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile and clients after auth
  const fetchUserData = async (userId: string): Promise<void> => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error('User profile not found');

      setProfile(profileData);
      setIsStrideShift(profileData.is_strideshift);

      // Fetch clients based on user type
      let clientsData: Client[] = [];
      if (profileData.is_strideshift) {
        // StrideShift users: fetch all active clients
        const { data, error } = await supabase
          .from('clients')
          .select('client_pk, client_code, client_name')
          .eq('is_active', true)
          .order('client_name');

        if (error) throw error;
        clientsData = data || [];
      } else if (profileData.client_pk) {
        // Regular users: fetch their specific client
        const { data, error } = await supabase
          .from('clients')
          .select('client_pk, client_code, client_name')
          .eq('client_pk', profileData.client_pk)
          .single();

        if (error) throw error;
        if (data) clientsData = [data];
      }

      setAvailableClients(clientsData);

      // Set initial client code from localStorage or first available
      const storedClient = localStorage.getItem(STORAGE_KEY);
      const validStoredClient = storedClient &&
        clientsData.some(c => c.client_code === storedClient);

      const initialClient = validStoredClient
        ? storedClient
        : clientsData[0]?.client_code || null;

      setClientCode(initialClient);
      if (initialClient) {
        localStorage.setItem(STORAGE_KEY, initialClient);
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear auth state on error
      setUser(null);
      setProfile(null);
      setClientCode(null);
      setAvailableClients([]);
      setIsStrideShift(false);
      setIsAuthenticated(false);
      // Sanitize error message for users
      const message = error instanceof Error
        ? 'Failed to load user data. Please try logging in again.'
        : 'Failed to load user data. Please try logging in again.';
      throw new Error(message);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user && mounted) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          try {
            await fetchUserData(session.user.id);
          } catch (error) {
            console.error('Error fetching user data on sign in:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setClientCode(null);
          setAvailableClients([]);
          setIsStrideShift(false);
          setIsAuthenticated(false);
          localStorage.removeItem(STORAGE_KEY);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Authentication failed');

      setUser(data.user);
      await fetchUserData(data.user.id);
    } catch (error) {
      console.error('Login error:', error);
      // Sanitize error message for users
      const message = error instanceof Error
        ? (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('credentials')
          ? 'Invalid email or password'
          : 'Login failed. Please try again.')
        : 'Login failed. Please try again.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear state (also handled by onAuthStateChange)
      setUser(null);
      setProfile(null);
      setClientCode(null);
      setAvailableClients([]);
      setIsStrideShift(false);
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      // Sanitize error message for users
      const message = 'Logout failed. Please try again.';
      throw new Error(message);
    }
  };

  const setActiveClient = (newClientCode: string): void => {
    // Validate that the client is available to this user
    const isValid = availableClients.some(c => c.client_code === newClientCode);

    if (!isValid) {
      console.error('Invalid client code:', newClientCode);
      return;
    }

    setClientCode(newClientCode);
    localStorage.setItem(STORAGE_KEY, newClientCode);
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Password update error:', error);
      // Sanitize error message for users
      const message = error instanceof Error
        ? (error.message.toLowerCase().includes('password')
          ? 'Password update failed. Please ensure your new password meets the requirements.'
          : 'Password update failed. Please try again.')
        : 'Password update failed. Please try again.';
      throw new Error(message);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Forgot password error:', error);
      // Sanitize error message for users
      const message = error instanceof Error
        ? (error.message.toLowerCase().includes('email')
          ? 'Invalid email address.'
          : 'Password reset request failed. Please try again.')
        : 'Password reset request failed. Please try again.';
      throw new Error(message);
    }
  };

  const value = useMemo((): AuthContextValue => ({
    user,
    profile,
    clientCode,
    availableClients,
    isStrideShift,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setActiveClient,
    updatePassword,
    forgotPassword,
  }), [user, profile, clientCode, availableClients, isStrideShift, isAuthenticated, isLoading, login, logout, setActiveClient, updatePassword, forgotPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// For backwards compatibility and dev reference only:
// Dev bypass using VITE_DEV_CLIENT_CODE has been removed.
// All authentication now goes through Supabase Auth.
