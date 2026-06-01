"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

export async function CreateCommodity(name: string, category: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${BASE_URL}/api/commodity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token!)}`,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, category }),
  })

  if (!res.ok) {
    const errText = await res.text()
    return { success: false, message: errText }
  }

  return { success: true }
}

export async function UpdateCommodity(id: string, name: string, category: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${BASE_URL}/api/commodity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token!)}`,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, name, category }),
  })

  if (!res.ok) {
    const errText = await res.text()
    return { success: false, message: errText }
  }

  return { success: true }
}

export async function DeleteCommodity(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${BASE_URL}/api/commodity`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token!)}`,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  })

  if (!res.ok) {
    const errText = await res.text()
    return { success: false, message: errText }
  }

  return { success: true }
}
