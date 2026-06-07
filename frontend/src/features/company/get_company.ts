"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

export async function GetCompany() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(`${BASE_URL}/api/company`, {
    method: "GET",
    headers: {
      Cookie: `token=${encodeURIComponent(token!)}`,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const errText = await res.text()
    
    // AUTO-RECOVERY MAGIC!
    // Jika Go backend menolak karena belum ada company, kita cek apakah ada data tersimpan di cookie
    const pendingDataStr = cookieStore.get("pending_company_data")?.value
    if (pendingDataStr) {
      try {
        const payload = JSON.parse(pendingDataStr)
        // Coba daftarkan otomatis sekarang juga
        const autoRes = await fetch(`${BASE_URL}/api/company`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${encodeURIComponent(token!)}`,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (autoRes.ok) {
          // Berhasil! Hapus cookie-nya agar tidak dobel
          cookieStore.delete("pending_company_data")
          
          // Fetch company-nya lagi sekarang juga (pasti berhasil)
          const secondTryRes = await fetch(`${BASE_URL}/api/company`, {
            method: "GET",
            headers: {
              Cookie: `token=${encodeURIComponent(token!)}`,
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          })
          if (secondTryRes.ok) {
            return await secondTryRes.json()
          }
        }
      } catch (e) {
        console.error("Auto-recovery gagal:", e)
      }
    }

    console.error("GetCompany Error:", res.status, errText)
    return { error: true, status: res.status, message: errText }
  }

  const data = await res.json()
  return data
}
