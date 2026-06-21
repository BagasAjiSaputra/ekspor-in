"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

export async function UpdateCompany(payload: { company_name: string, phone: string, address: string }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${BASE_URL}/api/company`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token!)}`,
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    return { error: data.error || data.message || "Gagal Update Perusahaan" }
  }
  
  return { success: true, message: data.message || "Berhasil Update Perusahaan", data }
}
