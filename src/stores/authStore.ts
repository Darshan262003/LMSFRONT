import { create } from 'zustand';

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

// Get stored auth data from localStorage
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to parse stored auth:', error);
  }
  return null;
};

const storedAuth = getStoredAuth();

export const authStore = create<AuthState>((set) => ({
  // Initialize from localStorage if available
  user: storedAuth?.state?.user || null,
  accessToken: storedAuth?.state?.accessToken || null,
  refreshToken: storedAuth?.state?.refreshToken || null,
  isAuthenticated: !!storedAuth?.state?.accessToken,

      login: (userData, accessToken, refreshToken) => {
        // Store in localStorage
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: userData,
            accessToken,
            refreshToken,
            isAuthenticated: true,
          },
          version: 0
        }));
          
        set({
          user: userData,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        console.log('Logging out...');
        // Clear localStorage
        localStorage.removeItem('auth-storage');
          
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAuth: (newAccessToken, newRefreshToken) => {
        // Update localStorage
        const current = getStoredAuth();
        if (current?.state) {
          current.state.accessToken = newAccessToken;
          current.state.refreshToken = newRefreshToken;
          localStorage.setItem('auth-storage', JSON.stringify(current));
        }
        
        set({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      },

      updateUser: (userData) => {
        // Update localStorage
        const current = getStoredAuth();
        if (current?.state) {
          current.state.user = userData;
          localStorage.setItem('auth-storage', JSON.stringify(current));
        }
        
        set({
          user: userData,
        });
      },
    }));
