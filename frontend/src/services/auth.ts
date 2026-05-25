import { api } from "@/lib/api-client";

export const authService = {
  register: (data: any) => api.post("/register", data),
  login: (data: any) => api.post("/login", data),
  getProfile: () => api.get("/api/profile"),
  updateProfile: (data: any) => api.put("/api/profile", data),
  requestVerify: () => api.post("/api/verified", {}),
  logout: () => api.post("/api/logout", {}),
  requestPasswordReset: (data: any) => api.post("/token-reset", data),
  resetPassword: (data: any) => api.post("/reset-password", data),
};
