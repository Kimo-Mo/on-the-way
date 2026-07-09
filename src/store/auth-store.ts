import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../types/auth';

type PersistedAuthState = AuthState;

/**
 * Zustand auth store with localStorage persistence.
 * Session validity is now managed dynamically via the refresh token.
 */
export const useAuthStore = create<PersistedAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (data) =>
        set((state) => ({
          user: data.user ?? state.user,
          token: data.token,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        })),
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'ontheway-auth-storage',
    }
  )
);
