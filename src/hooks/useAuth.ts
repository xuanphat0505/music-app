import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const initialize = useAuthStore((state) => state.initialize);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    initialize,
  };
};
