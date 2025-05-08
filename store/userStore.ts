import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the User type
interface User {
  _id?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

// Define the store state and actions
interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the store with persistence for React Native
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      
      // Actions
      setUser: (user) => set({ 
        user,
        isAuthenticated: !!user 
      }),
      
      login: (userData) => set({ 
        user: userData,
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null,
        isAuthenticated: false 
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;