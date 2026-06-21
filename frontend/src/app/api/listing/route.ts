import { NextResponse } from 'next/server';
import { BASE_URL } from '@/features/global/url';

export async function GET(req: Request) {
  try {
    const backendUrl = `${BASE_URL}/listing`;
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": req.headers.get("Authorization") || "",
      },
      cache: "no-store",
    });
    
    if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
    }
    const data = await response.json();

    // Fetch profiles
    const uniqueUserIds = [...new Set(data.map((l: any) => l.user_id).filter(Boolean))];
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

    return NextResponse.json({ data, profiles: profilesMap });
  } catch (error: any) {
    console.error("GET Proxy Error:", error);
    return NextResponse.json({ data: [], profiles: {} });
  }
}

export async function POST(req: Request) {
  try {
    // Ambil form data dari request frontend
    const formData = await req.formData();
    
    // Kirim secara manual ke backend Go (Bypass bug rewrite Next.js)
    const backendUrl = `${BASE_URL}/api/listing`;
    
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        // Teruskan header otorisasi
        "Authorization": req.headers.get("Authorization") || "",
      },
      body: formData, // Next.js fetch akan otomatis menyusun boundary yang benar!
    });
    
    const data = await response.text();
    let jsonData = {};
    try {
        jsonData = JSON.parse(data);
    } catch {
        jsonData = { message: data };
    }

    return NextResponse.json(jsonData, { status: response.status });
  } catch (error: any) {
    console.error("Custom Proxy Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan di server perantara (Proxy)" }, { status: 500 });
  }
}
