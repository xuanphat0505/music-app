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

  // songs endpoint
  SONGS: {
    BASE: "/songs",
    TRENDING: "/songs/trending",
    GENRES: "/songs/genres",
    DETAIL: (id: string) => `/songs/${id}`,
    PLAY: (id: string) => `/songs/${id}/play`,
    STREAM: (id: string) => `/songs/stream/${id}`,
    LYRICS: (id: string) => `/songs/${id}/lyrics`,
  },

  // artists endpoint
  ARTISTS: {
    BASE: "/artists",
    DETAIL: (id: string) => `/artists/${id}`,
    SONGS: (id: string) => `/artists/${id}/songs`,
  },

  // albums endpoint
  ALBUMS: {
    BASE: "/albums",
    DETAIL: (id: string) => `/albums/${id}`,
  },

  // libraries endpoint
  LIBRARIES: {
    TOGGLE: (songId: string) => `/libraries/toggle/${songId}`,
    SONGS: "/libraries/songs",
    IDS: "/libraries/ids",
  },

  // playlists endpoint
  PLAYLISTS: {
    BASE: "/playlists",
    DETAIL: (id: string) => `/playlists/${id}`,
    ADD_SONG: (id: string) => `/playlists/${id}/songs`,
    REMOVE_SONG: (id: string, songId: string) => `/playlists/${id}/songs/${songId}`,
  },
};
