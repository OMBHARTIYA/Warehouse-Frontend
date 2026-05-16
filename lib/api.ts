import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:3000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (typeof window !== "undefined") {
      if (status === 401) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } else if (status === 403) {
        toast.error("No permissions");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
