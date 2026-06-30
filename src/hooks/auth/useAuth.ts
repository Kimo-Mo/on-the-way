import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
// import api from '@/lib/axios';
import type { AdminUser } from '@/types/auth';

interface LoginResponse {
  token: string;
  user: AdminUser;
  expiresIn: number;
}

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };
};

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (/*credentials: Record<string, string>*/) => {
      // This is a placeholder for the actual API call to the backend for user authentication.
      // const { data } = await api.post<LoginResponse>('/api/auth/login', credentials);

      // Mocked response for testing purposes, should be replaced with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data: LoginResponse = {
        token: 'mocked-token',
        user: {
          id: '1',
          email: 'admin@ontheway.com',
          name: 'Admin User',
          role: 'admin',
          status: 'active',
        },
        expiresIn: 28800,
      };
      return data;
    },
    onSuccess: (data) => {
      login({ token: data.token, user: data.user, expiresIn: data.expiresIn });
    },
  });
};
