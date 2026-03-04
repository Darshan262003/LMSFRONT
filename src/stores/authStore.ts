import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAuth: (newAccessToken: string, newRefreshToken: string) => void;
  updateUser: (userData: User) => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (userData, accessToken, refreshToken) =>
        set({
          user: userData,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () => {
        console.log('Logging out...');
        return set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAuth: (newAccessToken, newRefreshToken) =>
        set({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        }),

      updateUser: (userData) =>
        set({
          user: userData,
        }),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
