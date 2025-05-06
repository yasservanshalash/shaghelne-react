import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, setAuthToken, setAuthUser, clearAuth } from '../utils/auth';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(credentials);
          
          // Save auth data
          setAuthToken(data.token);
          setAuthUser(data.user);
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          return data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.register(userData);
          
          // Save auth data
          setAuthToken(data.token);
          setAuthUser(data.user);
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          return data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        const token = useAuthStore.getState().token;
        await authApi.logout(token);
        
        // Clear auth data
        clearAuth();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuthStore.getState().token;
          const data = await authApi.updateProfile(profileData, token);
          
          // Update user data
          setAuthUser({ ...useAuthStore.getState().user, ...data });
          
          set(state => ({
            user: { ...state.user, ...data },
            isLoading: false,
          }));

          return data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage', // name for localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore; 