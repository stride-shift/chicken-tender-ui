export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  clientCode: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
