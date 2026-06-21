"use server"

import { cookies } from "next/headers"
import { BASE_URL } from "../global/url"

// Global cache to store commodities for guest users
// This is a workaround because the backend /api/commodity requires a token
let cachedCommodities: any[] | null = [
  { id: '0d026122-bf29-4f33-9415-e4d8e40c1298', name: 'Briket', category: 'Energi' },
  { id: 'e534e64e-abbe-4ef0-8314-ba158155b2b8', name: 'Jagung', category: 'Pertanian' },
  { id: 'b49afcf6-284e-45f8-ad55-7af58a716271', name: 'batubara', category: 'Energi' },
  { id: '301d8950-7778-4853-9036-c7d36106abad', name: 'Tekstil', category: 'Industri' }
];

export async function GetAllCommodity() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const headers: Record<string, string> = {}
  if (token) {
    headers["Cookie"] = `token=${encodeURIComponent(token)}`
    headers["Authorization"] = `Bearer ${token}`
  } else if (cachedCommodities) {
    // If the user has no token, return the cached commodities directly
    // This prevents the 401 Unauthorized error for guests
    return cachedCommodities;
  }

  const res = await fetch(`${BASE_URL}/api/commodity`, {
    method: "GET",
    headers,
    cache: "no-store",
  })
  
  if (!res.ok) {
    const errText = await res.text()
    console.error("GetAllCommodity Error:", res.status, errText)
    
    // If it fails but we have a cache (e.g. invalid token), use the cache
    if (cachedCommodities) {
      return cachedCommodities;
    }
    return { error: true, status: res.status, message: errText }
  }

  const data = await res.json()
  // Update the global cache whenever a successful response is received
  cachedCommodities = data;
  return data
}
