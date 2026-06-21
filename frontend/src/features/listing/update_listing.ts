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

    formData.append("id", id);

    const res = await fetch(`${BASE_URL}/api/manage-listing`, {
      method: "PUT",
      headers: {
        Cookie: `token=${encodeURIComponent(token)}`,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const dataText = await res.text();
    let data;
    try {
        data = JSON.parse(dataText);
    } catch {
        data = { message: dataText };
    }
    
    console.log("UpdateListing backend response:", res.status, data);
    const fs = require('fs');
    fs.appendFileSync('c:/Users/fatwa/update_log.txt', `[${new Date().toISOString()}] PUT id=${id} status=${res.status} data=${JSON.stringify(data)}\n`);

    if (!res.ok) {
      return { success: false, message: data.error || data.message || "Failed to update listing" };
    }

    return { success: true, message: data.message || "Berhasil Memperbarui Listing" };
  } catch (error: any) {
    const fs = require('fs');
    fs.appendFileSync('c:/Users/fatwa/update_log.txt', `[${new Date().toISOString()}] ERROR: ${error.message}\n`);
    console.error("UpdateListing Error:", error.message);
    return { success: false, message: "Internal Server Error" };
  }
}
