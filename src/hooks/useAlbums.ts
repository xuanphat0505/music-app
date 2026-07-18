import { useState, useEffect, useCallback } from "react";
import { musicApi } from "@/apis/musicApi";

// Hook lấy danh sách các album có phân trang và tìm kiếm
export const useAlbums = (q?: string, enabled = true) => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Tải danh sách album từ máy chủ
  const fetchAlbums = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const response = await musicApi.getAlbums({
        q,
        page: pageNum,
        limit: 10,
      });

      const { data, meta } = response;
      setAlbums((prev) => (isLoadMore ? [...prev, ...data] : data));
      setHasMore(meta.page < meta.totalPages);
      setPage(meta.page);
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách album.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [q]);

  useEffect(() => {
    if (enabled) {
      fetchAlbums(1, false);
    } else {
      setAlbums([]);
    }
  }, [fetchAlbums, enabled]);

  // Cuộn trang để tải thêm album
  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      fetchAlbums(page + 1, true);
    }
  }, [isLoading, isLoadingMore, hasMore, page, fetchAlbums]);

  // Làm mới danh sách album
  const refresh = useCallback(() => {
    fetchAlbums(1, false);
  }, [fetchAlbums]);

  return { albums, isLoading, isLoadingMore, error, refresh, loadMore, hasMore };
};

// Hook lấy thông tin chi tiết một album (kèm theo danh sách các bài hát trong album)
export const useAlbumDetail = (id: string) => {
  const [album, setAlbum] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tải thông tin chi tiết album
  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await musicApi.getAlbumDetail(id);
      setAlbum(data);
    } catch (err: any) {
      setError(err?.message || "Không thể tải thông tin chi tiết album.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { album, isLoading, error, refetch: fetchDetail };
};
