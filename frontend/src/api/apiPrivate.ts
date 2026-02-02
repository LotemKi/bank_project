import axios from "axios";
import Cookies from "js-cookie";

export const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

apiPrivate.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);