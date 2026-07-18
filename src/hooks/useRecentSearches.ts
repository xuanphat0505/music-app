import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import { RecentSearchEntity } from "@/types";

const RECENT_SEARCHES_KEY = "musichub_recent_searches";

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearchEntity[]>([]);

  // Tải danh sách lịch sử từ SecureStore khi khởi chạy
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const stored = await SecureStore.getItemAsync(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        } else {
          // Tạo một số dữ liệu mặc định ban đầu nếu chưa có lịch sử
          const initialMock: RecentSearchEntity[] = [
            {
              id: "mock-1",
              type: "artist",
              title: "Post Malone",
              subtitle: "Artist",
              imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=150",
              data: null,
            },
            {
              id: "mock-2",
              type: "song",
              title: "Midnight City",
              subtitle: "M83 • Song",
              imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150",
              data: null,
            },
          ];
          setRecentSearches(initialMock);
          await SecureStore.setItemAsync(RECENT_SEARCHES_KEY, JSON.stringify(initialMock));
        }
      } catch (error) {
        console.log("Error loading recent searches:", error);
      }
    };
    loadRecentSearches();
  }, []);

  // Hàm lưu thực thể tìm kiếm gần đây mới
  const saveRecentSearch = useCallback(
    async (item: RecentSearchEntity) => {
      try {
        setRecentSearches((prev) => {
          const filtered = prev.filter(
            (r) => !(r.id === item.id && r.type === item.type)
          );
          const updated = [item, ...filtered].slice(0, 10);
          SecureStore.setItemAsync(RECENT_SEARCHES_KEY, JSON.stringify(updated)).catch((e) =>
            console.log("SecureStore write error:", e)
          );
          return updated;
        });
      } catch (error) {
        console.log("Error saving search history item:", error);
      }
    },
    []
  );

  // Hàm xóa một mục duy nhất khỏi lịch sử
  const removeRecentSearch = useCallback(
    async (id: string) => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        setRecentSearches((prev) => {
          const updated = prev.filter((item) => item.id !== id);
          SecureStore.setItemAsync(RECENT_SEARCHES_KEY, JSON.stringify(updated)).catch((e) =>
            console.log("SecureStore write error:", e)
          );
          return updated;
        });
      } catch (error) {
        console.log("Error removing single search item:", error);
      }
    },
    []
  );

  // Hàm xóa toàn bộ lịch sử
  const clearRecentSearches = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setRecentSearches([]);
      await SecureStore.deleteItemAsync(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.log("Error clearing all recent searches:", error);
    }
  }, []);

  return {
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
};
