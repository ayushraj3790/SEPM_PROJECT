import axios from "axios";
import { getAuthData, saveAuthData, clearAuthData } from "./auth.utils";

const api = axios.create({ baseURL: import.meta.env.VITE_SERVER, withCredentials: true });

api.interceptors.request.use((config) => {
  const auth = getAuthData();
  if (auth?.accessToken) config.headers.Authorization = `Bearer ${auth.accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const isAuthCall = original?.url?.includes("/user/login") || original?.url?.includes("/user/refresh-token");
    if (err.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const stored = getAuthData();
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/user/refresh-token`,
          { refreshToken: stored?.refreshToken },
          { withCredentials: true }
        );
        const { user, accessToken, refreshToken } = res.data.data;
        saveAuthData({ user, accessToken, refreshToken });
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        clearAuthData();
        window.location.href = "/auth";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
