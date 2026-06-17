export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { token: string; user: AdminUser; expiresIn?: number }) => void;
  logout: () => void;
}
