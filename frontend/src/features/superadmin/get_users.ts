"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

export type UserData = {
  id: string;
  name?: string;
  full_name?: string;
  company_name?: string;
  location?: string;
  document_url?: string;
  role?: string;
  status?: string;
  is_approved?: boolean;
  created_at?: string;
  [key: string]: any;
}

export async function GetAllUsers(): Promise<UserData[]> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value || ""

    const res = await fetch(`${BASE_URL}/api/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Cookie": `token=${encodeURIComponent(token)}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Gagal mengambil data user")
    }

    const data = await res.json()
    console.log("GetAllUsers API Response:", JSON.stringify(data, null, 2))
    // Tergantung respons API, bisa jadi berupa array langsung atau object { data: [...] }
    if (Array.isArray(data)) {
        return data
    } else if (data && Array.isArray(data.data)) {
        return data.data
    }
    
    return []
  } catch (err) {
    console.error("GetAllUsers Error:", err)
    return []
  }
}
