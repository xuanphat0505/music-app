import axios from "axios";
import { BASE_URL, ENDPOINTS } from "./endpoints";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  triggerAuthFailure,
} from "@/services/tokenService";

// Khởi tạo đối tượng Axios Client dùng chung cho toàn hệ thống
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Cấu hình interceptor cho Request: tự động thêm token vào Authorization header
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Cấu hình interceptor cho Response: tự động làm mới token khi gặp lỗi 401 Unauthorized
let isRefreshing = false;
let failedQueue: any[] = [];

// Xử lý hàng đợi các request thất bại chờ làm mới token xong
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Trả về phần dữ liệu bọc bên trong cấu trúc response thống nhất của backend
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu gặp lỗi 401 chưa xác thực và chưa từng thử gửi lại request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        triggerAuthFailure();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Gọi thẳng axios instance khác để tránh lặp vô hạn
        const refreshResponse = await axios.post(
          `${BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          {
            refreshToken,
          },
        );

        const newTokens = refreshResponse.data.data;

        // Cập nhật lại các token mới vào tokenService
        setTokens(newTokens.accessToken, newTokens.refreshToken);

        processQueue(null, newTokens.accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        triggerAuthFailure();
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    const apiError = error.response?.data || error;
    return Promise.reject(apiError);
  },
);
