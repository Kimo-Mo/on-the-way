// ─── Admin Profile (GET /api/admin/settings/profile) ─────────────────────────

/**
 * Matches ProfileSettingsResponse from the API documentation exactly.
 * Note: the backend returns `fullName` (not `name`).
 */
export interface AdminProfile {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
}

// ─── Update Profile (PUT /api/admin/settings/profile) ────────────────────────

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
}
