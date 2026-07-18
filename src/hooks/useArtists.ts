import { useState, useEffect, useCallback } from "react";
import { musicApi } from "@/apis/musicApi";

// Hook lấy danh sách nghệ sĩ có phân trang và tìm kiếm
export const useArtists = (q?: string, enabled = true) => {
  const [artists, setArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Tải danh sách nghệ sĩ từ máy chủ
  const fetchArtists = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await musicApi.getArtists({
          q,
          page: pageNum,
          limit: 10,
        });

        const { data, meta } = response;
        setArtists((prev) => (isLoadMore ? [...prev, ...data] : data));
        setHasMore(meta.page < meta.totalPages);
        setPage(meta.page);
      } catch (err: any) {
        setError(err?.message || "Không thể tải danh sách nghệ sĩ.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [q],
  );

  useEffect(() => {
    if (enabled) {
      fetchArtists(1, false);
    } else {
      setArtists([]);
    }
  }, [fetchArtists, enabled]);

  // Tải thêm nghệ sĩ khi cuộn trang
  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      fetchArtists(page + 1, true);
    }
  }, [isLoading, isLoadingMore, hasMore, page, fetchArtists]);

  // Làm mới danh sách nghệ sĩ
  const refresh = useCallback(() => {
    fetchArtists(1, false);
  }, [fetchArtists]);

  return {
    artists,
    isLoading,
    isLoadingMore,
    error,
    refresh,
    loadMore,
    hasMore,
  };
};

// Hook lấy thông tin chi tiết một nghệ sĩ theo ID
export const useArtistDetail = (id: string) => {
  const [artist, setArtist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tải thông tin nghệ sĩ
  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await musicApi.getArtistDetail(id);
      setArtist(data);
    } catch (err: any) {
      setError(err?.message || "Không thể tải thông tin chi tiết nghệ sĩ.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { artist, isLoading, error, refetch: fetchDetail };
};

// Hook lấy danh sách bài hát của một nghệ sĩ có phân trang cuộn vô hạn
export const useArtistSongs = (artistId: string) => {
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Tải danh sách nhạc của ca sĩ
  const fetchSongs = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (!artistId) return;
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await musicApi.getArtistSongs(artistId, {
          page: pageNum,
          limit: 10,
        });

        const { data, meta } = response;
        setSongs((prev) => (isLoadMore ? [...prev, ...data] : data));
        setHasMore(meta.page < meta.totalPages);
        setPage(meta.page);
      } catch (err: any) {
        setError(
          err?.message || "Không thể tải danh sách bài hát của nghệ sĩ.",
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [artistId],
  );

  useEffect(() => {
    fetchSongs(1, false);
  }, [fetchSongs]);

  // Cuộn trang tải thêm nhạc
  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      fetchSongs(page + 1, true);
    }
  }, [isLoading, isLoadingMore, hasMore, page, fetchSongs]);

  // Làm mới danh sách nhạc của nghệ sĩ
  const refresh = useCallback(() => {
    fetchSongs(1, false);
  }, [fetchSongs]);

  return { songs, isLoading, isLoadingMore, error, refresh, loadMore, hasMore };
};
