import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  let initialUser: User | null = null;
  let initialToken: string | null = null;
  if (typeof window !== 'undefined') {
    initialToken = localStorage.getItem('sadgyanam_accessToken');
    const storedUser = localStorage.getItem('sadgyanam_user');
    if (storedUser) {
      try {
        initialUser = JSON.parse(storedUser);
      } catch (e) {
        initialUser = null;
      }
    }
  }

  return {
    user: initialUser,
    accessToken: initialToken,

    setAuth: (user, accessToken) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sadgyanam_accessToken', accessToken);
        localStorage.setItem('sadgyanam_user', JSON.stringify(user));
      }
      set({ user, accessToken });
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sadgyanam_accessToken');
        localStorage.removeItem('sadgyanam_user');
      }
      set({ user: null, accessToken: null });
    },
  };
});
