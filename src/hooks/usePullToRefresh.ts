import React, { useState, useCallback } from "react";
import { RefreshControl } from "react-native";
import { COLORS } from "@/constants/Colors";

// Custom Hook quản lý trạng thái kéo xuống làm mới và tự động cấu hình RefreshControl thống nhất
export const usePullToRefresh = (onRefreshCallback: () => Promise<any> | any) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefreshCallback();
    } catch (error) {
      console.warn("Lỗi khi tải lại dữ liệu:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefreshCallback]);

  // Sinh ra thẻ RefreshControl đã được style sẵn theo màu thương hiệu của ứng dụng
  const refreshControl = React.createElement(RefreshControl, {
    refreshing: isRefreshing,
    onRefresh: handleRefresh,
    tintColor: COLORS.PRIMARY,
  });

  return { isRefreshing, handleRefresh, refreshControl };
};
