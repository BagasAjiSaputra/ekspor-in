import { NextResponse } from 'next/server';
import { BASE_URL } from '@/features/global/url';

export async function POST(req: Request) {
  try {
    // Ambil form data dari request frontend
    const formData = await req.formData();
    
    // Kirim secara manual ke backend Go (Bypass bug rewrite Next.js)
    const backendUrl = `${BASE_URL}/api/manage-listing`;
    
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
