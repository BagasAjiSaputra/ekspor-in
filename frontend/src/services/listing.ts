import { api } from "@/lib/api-client";

export const listingService = {
  create: (data: any) => api.post("/api/listing", data),
  getAll: () => api.get("/listing"),
  getById: (id: string) => api.get(`/api/listing/${id}`), // Inferred pattern
};
