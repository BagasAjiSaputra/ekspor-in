"use server";

import { cookies } from "next/headers";
import { BASE_URL } from "../global/url";

export async function UpdateListingAction(id: string, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized: No token found" };
    }

    const res = await fetch(`${BASE_URL}/api/manage-listing/${id}`, {
      method: "PUT",
      headers: {
        Cookie: `token=${encodeURIComponent(token)}`,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    console.log("UpdateListing backend response:", res.status, data);

    if (!res.ok) {
      return { success: false, message: data.error || data.message || "Failed to update listing" };
    }

    return { success: true, message: data.message || "Berhasil Memperbarui Listing" };
  } catch (error: any) {
    console.error("UpdateListing Error:", error.message);
    return { success: false, message: "Internal Server Error" };
  }
}
