import { useState, useEffect, useCallback } from "react";
import { musicApi } from "@/apis/musicApi";

// Hook quản lý danh sách bài hát phân trang, tìm kiếm và lọc theo thể loại
export const useSongs = (filters: {
  genre?: string;
  q?: string;
  sort?: string;
}) => {
  const { genre, q, sort } = filters;
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Hàm tải danh sách bài hát từ API
  const fetchSongs = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await musicApi.getSongs({
          page: pageNum,
          limit: 10,
          genre,
          q,
          sort,
        });

        const { data, meta } = response;

        setSongs((prev) => (isLoadMore ? [...prev, ...data] : data));
        setHasMore(meta.page < meta.totalPages);
        setPage(meta.page);
      } catch (err: any) {
        setError(err?.message || "Không thể tải danh sách bài hát.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [genre, q, sort],
  );

  // Tự động tải lại trang đầu mỗi khi các bộ lọc thay đổi
  useEffect(() => {
    fetchSongs(1, false);
  }, [fetchSongs]);

  // Tải trang tiếp theo khi người dùng cuộn xuống dưới
  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      fetchSongs(page + 1, true);
    }
  }, [isLoading, isLoadingMore, hasMore, page, fetchSongs]);

  // Làm mới danh sách bài hát từ đầu
  const refresh = useCallback(() => {
    fetchSongs(1, false);
  }, [fetchSongs]);

  return { songs, isLoading, isLoadingMore, error, refresh, loadMore, hasMore };
};

// Hook lấy danh sách bài hát thịnh hành (Trending)
export const useTrendingSongs = (limit = 10) => {
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách bài hát hot nhất
  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await musicApi.getTrendingSongs(limit);
      setSongs(data);
    } catch (err: any) {
      setError(err?.message || "Không thể tải bài hát thịnh hành.");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return { songs, isLoading, error, refetch: fetchTrending };
};

// Hook lấy thống kê danh sách các thể loại nhạc
export const useGenresCount = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tải các thể loại nhạc từ máy chủ
  const fetchGenres = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await musicApi.getGenres();
      setGenres(data);
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách thể loại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return { genres, isLoading, error, refetch: fetchGenres };
};
