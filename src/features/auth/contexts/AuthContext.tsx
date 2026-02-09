import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { AuthContextValue, UserProfile, Client } from '../types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'tenderrender_active_client';

/**
 * Detect AbortError in all forms:
 * - Raw DOMException from navigator.locks / fetch
 * - Supabase-wrapped error objects with { message, details, hint, code }
 */
function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = String((error as { message: unknown }).message);
    if (msg.includes('AbortError') || msg.includes('signal is aborted')) return true;
  }
  return false;
}

/**
 * Recover the Supabase auth client after an AbortError permanently
 * rejects its cached initializePromise. Without this, every subsequent
 * operation (getSession, from().select(), etc.) fails forever.
 */
async function recoverSupabaseAuth(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = supabase.auth as any;
  auth.initializePromise = null;
  await auth.initialize();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [clientCode, setClientCode] = useState<string | null>(null);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [isStrideShift, setIsStrideShift] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isFetchingRef = useRef(false);
  const isManualLoginRef = useRef(false);

  // Fetch user profile and clients after auth.
  // IMPORTANT: Must NOT be called from inside an onAuthStateChange callback —
  // doing so deadlocks because from().select() needs getSession() which needs
  // the same navigator.locks lock that onAuthStateChange holds.
  const fetchUserData = useCallback(async (userId: string): Promise<void> => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

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
        const { data, error } = await supabase
          .from('clients')
          .select('client_pk, client_code, client_name')
          .eq('is_active', true)
          .order('client_name');

        if (error) throw error;
        clientsData = data || [];
      } else if (profileData.client_pk) {
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
      setProfile(null);
      setClientCode(null);
      setAvailableClients([]);
      setIsStrideShift(false);
      setIsAuthenticated(false);
      throw new Error('Failed to load user data. Please try logging in again.');
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Effect 1: Listen for auth state changes.
  // Only manages user state — NEVER calls fetchUserData (deadlock risk).
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setClientCode(null);
          setAvailableClients([]);
          setIsStrideShift(false);
          setIsAuthenticated(false);
          setIsLoading(false);
          localStorage.removeItem(STORAGE_KEY);
        } else if (event === 'INITIAL_SESSION' && !session) {
          // No existing session — stop loading
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Effect 2: Fetch user profile when user changes (from auth events).
  // Runs OUTSIDE the onAuthStateChange callback, so the Supabase lock is free.
  // NOTE: No cancellation pattern here. In StrictMode, the first run starts
  // fetchUserData (guarded by isFetchingRef), the second run skips it.
  // The first run's completion MUST set isLoading=false regardless of
  // StrictMode cleanup, otherwise isLoading stays true → blank screen.
  useEffect(() => {
    if (!user || isAuthenticated || isManualLoginRef.current || isFetchingRef.current) {
      return;
    }

    (async () => {
      try {
        await fetchUserData(user.id);
      } catch (error) {
        if (isAbortError(error)) {
          try {
            await recoverSupabaseAuth();
            isFetchingRef.current = false;
            await fetchUserData(user.id);
          } catch (retryError) {
            console.error('Error loading user data after recovery:', retryError);
          }
        } else {
          console.error('Error loading user data:', error);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user, isAuthenticated, fetchUserData]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    isManualLoginRef.current = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Authentication failed');

      setUser(data.user);

      // Fetch user data directly. signInWithPassword doesn't hold the lock,
      // so from().select() → getSession() works fine here.
      try {
        await fetchUserData(data.user.id);
      } catch (fetchError) {
        if (isAbortError(fetchError)) {
          await recoverSupabaseAuth();
          isFetchingRef.current = false;
          await fetchUserData(data.user.id);
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof Error
        ? (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('credentials')
          ? 'Invalid email or password'
          : 'Login failed. Please try again.')
        : 'Login failed. Please try again.';
      throw new Error(message);
    } finally {
      isManualLoginRef.current = false;
      setIsLoading(false);
    }
  }, [fetchUserData]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setClientCode(null);
      setAvailableClients([]);
      setIsStrideShift(false);
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  }, []);

  const setActiveClient = useCallback((newClientCode: string): void => {
    const isValid = availableClients.some(c => c.client_code === newClientCode);

    if (!isValid) {
      console.error('Invalid client code:', newClientCode);
      return;
    }

    setClientCode(newClientCode);
    localStorage.setItem(STORAGE_KEY, newClientCode);
  }, [availableClients]);

  const updatePassword = useCallback(async (newPassword: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Password update error:', error);
      const message = error instanceof Error
        ? (error.message.toLowerCase().includes('password')
          ? 'Password update failed. Please ensure your new password meets the requirements.'
          : 'Password update failed. Please try again.')
        : 'Password update failed. Please try again.';
      throw new Error(message);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Forgot password error:', error);
      const message = error instanceof Error
        ? (error.message.toLowerCase().includes('email')
          ? 'Invalid email address.'
          : 'Password reset request failed. Please try again.')
        : 'Password reset request failed. Please try again.';
      throw new Error(message);
    }
  }, []);

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
