import { z } from 'zod';

// ─── Enums (integer values match backend exactly) ─────────────────────────────

/** Backend sends status as a string: "Active" | "Suspended" | "Banned" */
export type UserStatus = 'Active' | 'Suspended' | 'Banned';

/** Backend sends role as a string: "User" | "Admin" */
export type UserRole = 'User' | 'Admin';

// ─── Numeric enum (const object, compatible with erasableSyntaxOnly) ──────────

export const UserStatusEnum = {
  Active: 1,
  Suspended: 2,
  Banned: 3,
} as const;

export type UserStatusEnum = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];

/** Maps display string → backend integer for status update requests */
export const userStatusToNumeric: Record<UserStatus, UserStatusEnum> = {
  Active: UserStatusEnum.Active,
  Suspended: UserStatusEnum.Suspended,
  Banned: UserStatusEnum.Banned,
};

export interface UpdateUserStatusRequest {
  newStatus: UserStatusEnum;
}

// ─── Core User (GET /api/admin/users — list item) ─────────────────────────────

/** Matches AdminUserListItem from the API documentation exactly. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  trustScore: number;
}

// ─── Activity Item (inside AdminUserDetailsResponse.activityHistory) ──────────

export interface UserActivity {
  description: string;
  type: string;
  date: string; // ISO 8601
}

// ─── Full User Details (GET /api/admin/users/{id}) ────────────────────────────

/** Matches AdminUserDetailsResponse from the API documentation exactly. */
export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  trustScore: number;
  joinedDate: string; // ISO 8601
  activityHistory: UserActivity[];
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface UsersQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  status?: string;
}

// ─── Paginated List Response ──────────────────────────────────────────────────

/** The backend returns a plain array for GET /api/admin/users. */
export interface UsersListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Shared PaginatedResponse helper ─────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Register Admin Request ───────────────────────────────────────────────────

export const registerAdminSchema = z
  .object({
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterAdminRequest = z.infer<typeof registerAdminSchema>;
