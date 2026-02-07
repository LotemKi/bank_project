import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
