import { useEffect, useCallback } from "react";
import { useLibraryStore } from "@/store/libraryStore";

// Hook bọc kết nối với Zustand Store toàn cục để đồng bộ trạng thái lưu bài hát trong toàn bộ ứng dụng
export const useLibrarySongs = (enabled = true) => {
  const librarySongs = useLibraryStore((state) => state.librarySongs);
  const librarySongIds = useLibraryStore((state) => state.librarySongIds);
  const isLoading = useLibraryStore((state) => state.isLoading);
  const isFetchingNextPage = useLibraryStore((state) => state.isFetchingNextPage);
  const hasMore = useLibraryStore((state) => state.hasMore);
  const isInitialized = useLibraryStore((state) => state.isInitialized);
  const error = useLibraryStore((state) => state.error);
  const fetchLibraryData = useLibraryStore((state) => state.fetchLibraryData);
  const fetchNextPage = useLibraryStore((state) => state.fetchNextPage);
  const toggleSongStore = useLibraryStore((state) => state.toggleSong);

  // Tải danh sách lần đầu khi khởi tạo nếu chưa từng fetch và được bật
  useEffect(() => {
    if (enabled && !isInitialized && !isLoading) {
      fetchLibraryData();
    }
  }, [enabled, fetchLibraryData, isInitialized, isLoading]);

  // Kiểm tra bài hát đã thuộc thư viện cá nhân hay chưa
  const isSongInLibrary = useCallback(
    (songId: string) => librarySongIds.includes(songId),
    [librarySongIds],
  );

  return {
    librarySongs,
    librarySongIds,
    isLoading,
    isFetchingNextPage,
    hasMore,
    error,
    refreshLibrary: fetchLibraryData,
    fetchNextPage,
    toggleSong: toggleSongStore,
    isSongInLibrary,
  };
};
