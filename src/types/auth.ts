import { z } from 'zod';

// ─── Backend API Schemas (matching API_DOCUMENTATION.md exactly) ──────────────

/** POST /api/auth/register — request body */
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** POST /api/auth/login — request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /api/auth/verify-email — request body */
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

/** POST /api/auth/forget-password — request body */
export interface ForgetPasswordRequest {
  email: string;
}

/** POST /api/auth/reset-password — request body */
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(1, 'OTP is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
});

/** POST /api/auth/google-login — request body */
export interface GoogleLoginRequest {
  idToken: string;
}

// ─── Auth — Responses ─────────────────────────────────────────────────────────

export interface RegisterResponse {
  isSuccess: boolean;
  message: string;
  otp: string | null;
  errors: unknown | null;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  token: string | null;
  refreshToken: string;
}

export interface VerifyOtpResponse {
  isSuccess: boolean;
  message: string;
}

export interface ForgetPasswordResponse {
  isSuccess: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  isSuccess: boolean;
  message: string;
  errors: unknown | null;
}

export interface GoogleLoginResponse {
  isSuccess: boolean;
  message: string;
  token: string | null;
}

/** POST /api/auth/refresh — response payload */
export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

// ─── Domain Types ──────────────────────────────────────────────────────────────

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
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (data: { token: string; refreshToken: string; user?: AdminUser | null }) => void;
  logout: () => void;
}
