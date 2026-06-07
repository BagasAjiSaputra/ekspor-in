import { api } from "@/lib/api-client";

export const listingService = {
  create: async (data: any) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const response = await fetch("/api/manage-listing", {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data, // Ini FormData
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Gagal upload");
    return result;
  },
  getAll: () => api.get("/listing"),
  getById: (id: string) => api.get(`/api/listing/${id}`),
};
