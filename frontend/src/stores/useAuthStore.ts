import { create } from 'zustand';
// import { persist } from 'zustand/middleware'; // Persist user info across refreshes

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean; // <--- NEW: Are we currently verifying?
  setUser: (user: User) => void;
  setCheckingAuth: (status: boolean) => void; // <--- NEW
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true, // Start as TRUE (we assume we need to check on load)
  
  setUser: (user) => set({ user, isAuthenticated: true, isCheckingAuth: false }),
  setCheckingAuth: (status) => set({ isCheckingAuth: status }),
  logout: () => set({ user: null, isAuthenticated: false, isCheckingAuth: false }),
}));

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,
//       setUser: (user) => set({ user, isAuthenticated: true }),
//       logout: () => set({ user: null, isAuthenticated: false }),
//     }),
//     {
//       name: 'auth-storage', // name of item in localStorage (only stores user info, not token)
//     }
//   )
// );