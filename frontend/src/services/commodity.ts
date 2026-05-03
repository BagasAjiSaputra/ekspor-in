import { api } from "@/lib/api-client";

export const commodityService = {
  create: (data: any) => api.post("/api/commodity", data),
  update: (data: any) => api.put("/api/commodity", data),
  delete: (id: string) => api.delete("/api/commodity", { id }),
};
