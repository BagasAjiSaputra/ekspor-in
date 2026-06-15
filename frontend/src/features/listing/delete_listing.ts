"use server";

import { cookies } from "next/headers";
import { BASE_URL } from "../global/url";

export async function DeleteListingAction(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized: No token found" };
    }

    const res = await fetch(`${BASE_URL}/api/manage-listing`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${encodeURIComponent(token)}`,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    const text = await res.text();
    if (!res.ok) {
      try {
        const errorData = JSON.parse(text);
        return { success: false, message: errorData.error || errorData.message || text || res.statusText || "Gagal Menghapus" };
      } catch (e) {
        return { success: false, message: text || res.statusText || "Gagal Menghapus" };
      }
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }
    
    console.log("DeleteListing backend response:", res.status, data);

    // DEBUG LOG
    const fs = require('fs');
    fs.appendFileSync('c:/Users/fatwa/delete_log.txt', `[${new Date().toISOString()}] DELETE id=${id} status=${res.status} data=${JSON.stringify(data)}\n`);

    if (!res.ok) {
      return { success: false, message: data.error || data.message || "Gagal menghapus postingan. Status: " + res.status };
    }

    return { success: true, message: data.message || "Berhasil menghapus postingan" };
  } catch (error: any) {
    console.error("DeleteListing Error:", error.message);
    return { success: false, message: "Internal Server Error" };
  }
}
