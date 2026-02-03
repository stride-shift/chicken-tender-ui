import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface Client {
  client_pk: number;
  client_code: string;
  client_name: string;
}

export interface UserProfile {
  user_id: string;
  client_pk: number | null;
  display_name: string | null;
  role: string;
  is_strideshift: boolean;
}

export interface AuthState {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  clientCode: string | null;
  availableClients: Client[];
  isStrideShift: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setActiveClient: (clientCode: string) => void;
  updatePassword: (newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}
