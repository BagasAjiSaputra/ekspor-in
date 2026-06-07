"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

export async function ApproveUserAction(userId: string, approve: boolean) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value || ""

    const res = await fetch(`${BASE_URL}/api/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Cookie": `token=${encodeURIComponent(token)}`,
      },
      body: JSON.stringify({
        user_id: userId,
        approve: approve,
      }),
      cache: "no-store",
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      return { success: false, message: errData.error || errData.message || "Gagal mengubah status" }
    }

    return { success: true, message: "Status berhasil diubah" }
  } catch (err: any) {
    console.error("ApproveUserAction Error:", err)
    return { success: false, message: err.message || "Terjadi kesalahan sistem" }
  }
}
