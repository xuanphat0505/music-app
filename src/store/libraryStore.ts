import { create } from "zustand";
import { libraryApi } from "@/apis/libraryApi";
import { Track } from "@/types";
import { LIBRARY_PAGE_LIMIT } from "@/constants/config";

interface LibraryState {
  librarySongs: Track[];
  librarySongIds: string[];
  page: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isInitialized: boolean;
  error: string | null;
  pendingToggles: Set<string>;
  fetchLibraryData: (isRefresh?: boolean) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  toggleSong: (song: Track) => Promise<void>;
  isSongInLibrary: (songId: string) => boolean;
}

// Zustand store quản lý trạng thái toàn cục cho thư viện bài hát cá nhân
export const useLibraryStore = create<LibraryState>((set, get) => ({
  librarySongs: [],
  librarySongIds: [],
  page: 1,
  totalPages: 1,
  hasMore: true,
  isLoading: false,
  isFetchingNextPage: false,
  isInitialized: false,
  error: null,
  pendingToggles: new Set<string>(),

  // Tải danh sách bài hát trang đầu tiên và mảng ID từ server về store
  fetchLibraryData: async (isRefresh = true) => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const [songsResponse, idsData] = await Promise.all([
        libraryApi.getLibrarySongs({ page: 1, limit: LIBRARY_PAGE_LIMIT }),
        libraryApi.getLibrarySongIds(),
      ]);
      const songs = songsResponse.data || [];
      const meta = songsResponse.meta || { page: 1, totalPages: 1 };
      const totalPagesNum = meta.totalPages || 1;
      set({
        librarySongs: songs,
        librarySongIds: idsData || [],
        page: 1,
        totalPages: totalPagesNum,
        hasMore: 1 < totalPagesNum,
        isLoading: false,
        isInitialized: true,
      });
    } catch (err: any) {
      set({
        error: err?.message || "Không thể tải danh sách thư viện.",
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  // Tải trang bài hát kế tiếp khi người dùng cuộn tới chân trang
  fetchNextPage: async () => {
    const { page, totalPages, hasMore, isFetchingNextPage, isLoading, librarySongs } = get();
    if (isFetchingNextPage || isLoading || !hasMore || page >= totalPages) return;

    set({ isFetchingNextPage: true });
    const nextPage = page + 1;
    try {
      const songsResponse = await libraryApi.getLibrarySongs({
        page: nextPage,
        limit: LIBRARY_PAGE_LIMIT,
      });
      const newSongs = songsResponse.data || [];
      const meta = songsResponse.meta || { totalPages: 1 };
      const totalPagesNum = meta.totalPages || totalPages;

      set({
        librarySongs: [...librarySongs, ...newSongs],
        page: nextPage,
        totalPages: totalPagesNum,
        hasMore: nextPage < totalPagesNum,
        isFetchingNextPage: false,
      });
    } catch {
      set({
        isFetchingNextPage: false,
      });
    }
  },

  // Thêm hoặc xóa bài hát khỏi thư viện đồng bộ cho toàn bộ ứng dụng với phản hồi tức thì
  toggleSong: async (song: Track) => {
    const songId = song._id;
    const { pendingToggles, librarySongIds, librarySongs } = get();

    if (pendingToggles.has(songId)) return;

    const nextPending = new Set(pendingToggles);
    nextPending.add(songId);
    set({ pendingToggles: nextPending });

    const isAlreadyAdded = librarySongIds.includes(songId);
    const previousIds = [...librarySongIds];
    const previousSongs = [...librarySongs];

    if (isAlreadyAdded) {
      set({
        librarySongIds: librarySongIds.filter((id) => id !== songId),
        librarySongs: librarySongs.filter((item) => item._id !== songId),
      });
    } else {
      set({
        librarySongIds: [...librarySongIds, songId],
        librarySongs: [song, ...librarySongs],
      });
    }

    try {
      await libraryApi.toggleLibrarySong(songId);
    } catch {
      set({
        librarySongIds: previousIds,
        librarySongs: previousSongs,
      });
    } finally {
      const updatedPending = new Set(get().pendingToggles);
      updatedPending.delete(songId);
      set({ pendingToggles: updatedPending });
    }
  },

  // Kiểm tra xem bài hát có thuộc mảng ID bài hát đã lưu trong store hay không
  isSongInLibrary: (songId: string) => {
    return get().librarySongIds.includes(songId);
  },
}));
