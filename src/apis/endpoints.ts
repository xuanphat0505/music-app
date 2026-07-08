export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Các API endpoints của hệ thống
export const ENDPOINTS = {
  // auth endpoint
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  // user endpoint
  USERS: {
    PROFILE: "/users/profile",
    SETTINGS: "/users/settings",
  },
};
