import { api } from "./api";

export interface AdminMe {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const adminApi = {
  me: () => api.get<AdminMe>("/admin/auth/me"),
  login: (email: string, password: string) => api.post<AdminMe>("/admin/auth/login", { email, password }),
  logout: () => api.post("/admin/auth/logout"),
};
