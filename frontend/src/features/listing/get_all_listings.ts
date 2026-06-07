"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

export async function GetAllListings() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${BASE_URL}/listing`, {
    method: "GET",
    headers: {
      Cookie: `token=${encodeURIComponent(token!)}`,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("GetAllListings Error:", res.status, errText)
    return { error: true, status: res.status, message: errText }
  }

  const data = await res.json()
  return data
}
