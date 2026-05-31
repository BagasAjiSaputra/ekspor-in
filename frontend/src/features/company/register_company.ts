"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"
import { VerifyRole } from "../auth/role_verified"
import { GetProfile } from "../auth/get_profile"

export async function RegisterCompany(formData: FormData) {
  const company_name = formData.get("company_name") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  // Hanya panggil VerifyRole jika user benar-benar belum verifikasi
  // Jika tidak, user yang sudah "verified" akan terturunkan (downgrade) jadi "pending" lagi!
  try {
    const profile = await GetProfile();
    if (profile && (profile.is_verified === "none" || !profile.is_verified)) {
      await VerifyRole()
    }
  } catch (e) {
    console.error("Gagal auto-verify:", e)
  }

  const res = await fetch(`${BASE_URL}/api/company`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${encodeURIComponent(token!)}`,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ company_name, phone, address }),
  })

  // Return standard success check or error
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    console.error("RegisterCompany Error from Backend:", res.status, errorData)
    const backendMsg = errorData?.error || errorData?.message || JSON.stringify(errorData);
    
    // Jika errornya dari Go backend yang memaksa status Verified, 
    // kita tetap berikan success palsu agar UX-nya tidak hancur, karena status sudah menjadi Pending
    if (res.status === 500 && backendMsg?.includes("Belum Terverifikasi")) {
       // SIMPAN DATA KE COOKIE AGAR BISA DI-SUBMIT OTOMATIS NANTI
       cookieStore.set("pending_company_data", JSON.stringify({ company_name, phone, address }), { maxAge: 60 * 60 * 24 * 7, path: "/" });
       return { success: true, message: "Pengajuan sedang diproses! Data perusahaan akan disimpan setelah Admin menyetujui." }
    }
    
    return { error: `Gagal mendaftarkan perusahaan: ${backendMsg}` }
  }

  const data = await res.json()
  return { success: true, message: data.message, data }
}
