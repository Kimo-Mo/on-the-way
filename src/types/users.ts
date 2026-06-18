// ─── Role & Status ───────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'driver' | 'serviceProvider';
export type UserStatus = 'active' | 'suspended' | 'pending';

// ─── Core User (used in the list table) ──────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  trustScore: number;
  joinedAt: string;
  avatarUrl?: string;
}

// ─── Activity ────────────────────────────────────────────────────────────────
export type UserActivityType =
  | 'reportSubmitted'
  | 'reportVerified'
  | 'helpRequestCreated'
  | 'helpRequestResolved'
  | 'profileUpdated'
  | 'suspended'
  | 'reactivated';

export interface UserActivity {
  id: string;
  userId: string;
  type: UserActivityType;
  description: string;
  timestamp: string;
  relatedEntityId?: string;
  relatedEntityRoute?: string;
}

// ─── Full User Details (used on /users/:id) ───────────────────────────────────
export interface UserDetails extends User {
  phone?: string;
  address?: string;
  vehicleInfo?: string;
  activityHistory: UserActivity[];
}

// ─── Query Params (sent to API) ───────────────────────────────────────────────
export interface UsersQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

// ─── Paginated List Response (from API) ───────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type UsersListResponse = PaginatedResponse<User>;