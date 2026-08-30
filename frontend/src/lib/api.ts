import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL ?? "/api";

const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/** DRF may return a plain array or paginated `{ results: [...] }`. */
export function asList<T>(data: T[] | { results?: T[] }): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login/", { username, password });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me/");
  return data;
}
