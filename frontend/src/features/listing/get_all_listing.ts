"use server"

import { BASE_URL } from "../global/url"

export type Listing = {
  id: string
  title: string
  description: string
  image_url: string
  price_buy: number
  min_volume: number
  quality: string
  address: string
  created_at: string
}

export async function getListings(): Promise<Listing[]> {
  try {
    const res = await fetch(`${BASE_URL}/listing`, {
      method: "GET",
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed fetch listing")
    }

    const data = await res.json()

    return data
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getListingsWithProfiles() {
  try {
    const data = await getListings();
    
    // Fetch profiles for unique user_ids on the server to avoid browser connection limits
    const uniqueUserIds = [...new Set(data.map((l: any) => l.user_id).filter(Boolean))];
    
    // Fetch directly to bypass Next.js Server Action self-POST deadlocks
    const profilesData = await Promise.all(uniqueUserIds.map(async (userId) => {
        try {
            const res = await fetch(`${BASE_URL}/user/public?id=${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            });
            if (!res.ok) return null;
            const resData = await res.json();
            return resData.user || resData;
        } catch (err) {
            return null;
        }
    }));
    
    const profilesMap: Record<string, any> = {};
    profilesData.forEach((profile, idx) => {
        if (profile) {
            profilesMap[uniqueUserIds[idx] as string] = profile;
        }
    });

    return { data, profiles: profilesMap };
  } catch (err) {
    console.error(err);
    return { data: [], profiles: {} };
  }
}