import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { LoginRequest, LoginResponse, AdminUser, ForgetPasswordRequest, ResetPasswordRequest, ForgetPasswordResponse, ResetPasswordResponse } from '@/types/auth';
import { toast } from 'sonner';

// ─── Auth State ──────────────────────────────────────────────────────────────

/**
 * Hook that exposes the current authentication state and actions from the Zustand store.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    login,
    logout,
  };
};

// ─── Login ───────────────────────────────────────────────────────────────────

interface AdminProfile {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
}

interface LoginResult {
  token: string;
  refreshToken: string;
  user: AdminUser;
}

const getErrorMessage = (error: { message?: string } | string | null | undefined): string => {
  if (typeof error === 'string') {
    return error;
  }
  return error?.message ?? 'Login failed.';
};

const extractLoginTokens = (
  response: ApiResponse<LoginResponse>
): { token: string; refreshToken: string } => {
  if (!response.isSuccess || response.data === null) {
    throw new Error(getErrorMessage(response.error));
  }

  const { token, refreshToken } = response.data;
  if (!token || !refreshToken) {
    throw new Error('Login failed: Missing authentication tokens from server.');
  }

  return { token, refreshToken };
};

const fetchAdminUser = async (credentials: { email?: string }, token: string): Promise<AdminUser> => {
  try {
    const response = await api.get<ApiResponse<AdminProfile>>('/admin/settings/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profile = response.data.data;

    if (response.data.isSuccess && profile) {
      return {
        id: 'admin-1',
        email: profile.email,
        name: profile.fullName,
        role: profile.role,
        status: 'Active',
      };
    }
  } catch {
    // Fall back to deriving the user from the provided credentials.
  }

  return {
    id: 'admin-1',
    email: credentials.email || 'admin@example.com',
    name: credentials.email ? credentials.email.split('@')[0] : 'Admin',
    role: 'Admin',
    status: 'Active',
  };
};

/**
 * Mutation hook for logging in via POST /api/auth/login.
 * Since the login endpoint only returns tokens (no user object), we fetch the
 * admin profile immediately after login to get user details.
 */
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResult> => {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      const { token, refreshToken } = extractLoginTokens(response.data);
      const user = await fetchAdminUser(credentials, token);

      return { token, refreshToken, user };
    },
    onSuccess: ({ token, refreshToken, user }) => {
      login({ token, refreshToken, user });
      toast.success('Login successful');
    },
  });
};

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgetPasswordRequest) => {
      const response = await api.post<ApiResponse<ForgetPasswordResponse>>('/auth/forget-password', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset email sent if account exists.');
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await api.post<ApiResponse<ResetPasswordResponse>>('/auth/reset-password', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password successfully reset. You can now login.');
    },
  });
};


// ─── Logout ──────────────────────────────────────────────────────────────────

/**
 * Mutation hook for logging out via POST /api/admin/settings/logout.
 * Makes a best-effort server-side logout, then always clears local auth state.
 */
export const useLogout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await api.post('/admin/settings/logout');
    },
    onSettled: () => {
      logout();
    },
    onError: () => {
      logout();
    },
  });
};
