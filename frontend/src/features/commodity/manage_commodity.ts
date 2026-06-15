"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

export async function CreateCommodity(name: string, category: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return { success: false, message: "Unauthorized: No token found" }
  }

  const res = await fetch(`${BASE_URL}/api/commodity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token)}`,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, category }),
  })

  if (!res.ok) {
    const errText = await res.text()
    try {
      const parsed = JSON.parse(errText)
      return { success: false, message: parsed.error || errText }
    } catch {
      return { success: false, message: errText }
    }
  }

  return { success: true }
}

export async function UpdateCommodity(id: string, name: string, category: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return { success: false, message: "Unauthorized: No token found" }
  }

  const res = await fetch(`${BASE_URL}/api/commodity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token)}`,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, name, category }),
  })

  if (!res.ok) {
    const errText = await res.text()
    try {
      const parsed = JSON.parse(errText)
      return { success: false, message: parsed.error || errText }
    } catch {
      return { success: false, message: errText }
    }
  }

  return { success: true }
}

export async function DeleteCommodity(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return { success: false, message: "Unauthorized: No token found" }
  }

  const res = await fetch(`${BASE_URL}/api/commodity`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token)}`,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.log("DeleteCommodity Error:", res.status, errText)
    try {
      const parsed = JSON.parse(errText)
      return { success: false, message: parsed.error || parsed.message || errText || res.statusText || "Gagal Menghapus" }
    } catch {
      return { success: false, message: errText || res.statusText || "Gagal Menghapus" }
    }
  }

  return { success: true }
}
