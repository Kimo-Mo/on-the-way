import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AdminUser } from '../types/auth';

interface PersistedAuthState extends AuthState {
  expiresAt: number | null;
}

export const useAuthStore = create<PersistedAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      expiresAt: null,
      isAuthenticated: false,
      login: (data: { token: string; user: AdminUser; expiresIn?: number }) => {
        // Default to 8 hours (28800 seconds) if not provided by backend
        const expiresInSeconds = data.expiresIn || 28800;
        const expiresAt = Date.now() + expiresInSeconds * 1000;
        
        set({
          user: data.user,
          token: data.token,
          expiresAt,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'ontheway-auth-storage',
      onRehydrateStorage: () => (state) => {
        // Check if session has expired upon rehydration
        if (state && state.expiresAt && Date.now() > state.expiresAt) {
          state.logout();
        }
      },
    }
  )
);
