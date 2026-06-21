"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BASE_URL } from "../global/url"

export async function UpdateProfile(payload: { name: string, email: string, password?: string, user_image?: string }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token!)}`,
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  console.log("UPDATE PROFILE PAYLOAD:", payload)
  console.log("UPDATE PROFILE BACKEND RESPONSE:", res.status, data)

  if (!res.ok) {
    return { error: data.error || data.message || "Gagal Update Profile" }
  }
  
  return { success: true, message: data.message || "Berhasil Update Profile", data }
}