"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

export async function UploadProfileImage(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  try {
    const res = await fetch(`${BASE_URL}/api/profile/upload`, {
      method: "POST",
      headers: {
        Cookie: `token=${encodeURIComponent(token!)}`,
        Authorization: `Bearer ${token}`
      },
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      return { error: data.error || data.message || "Gagal mengunggah foto profil" }
    }
    
    return { success: true, data: data }
  } catch (err) {
    return { error: "Terjadi kesalahan sistem saat upload gambar" }
  }
}
