import { useAuthStore } from "@/stores/useAuthStore";
import api from "./axios";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (error: any) => void }> = [];

function processQueue(error: any = null) {
  failedQueue.forEach(p => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve();
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const url = originalRequest?.url || "";

    // 🚫 Skip refresh for these routes (auth endpoints only)
    const skipRefresh =
      url.includes("/auth/login") ||
      url.includes("/auth/signup") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout") ||
      url.includes("/users/profile");

    if (
      status === 401 &&
      !originalRequest._retry &&
      !skipRefresh
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((error) => Promise.reject(error));
      }

      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        isRefreshing = false;
        processQueue();
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        console.log("REFRESH FAILED", refreshError);
        isRefreshing = false;
        processQueue(refreshError);

        const { isAuthenticated } = useAuthStore.getState();

        useAuthStore.getState().logout();

        if (isAuthenticated && !window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
