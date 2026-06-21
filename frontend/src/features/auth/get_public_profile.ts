"use server"

import { BASE_URL } from "../global/url"

export async function GetPublicProfile(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/user/public?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // We can use ISR or revalidate later if needed
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.user || data
  } catch (err) {
    console.error(err)
    return null
  }
}
