import { api } from "@/lib/api-client";

export const companyService = {
  register: (data: any) => api.post("/api/company", data),
  update: (data: any) => api.put("/api/company", data),
};
