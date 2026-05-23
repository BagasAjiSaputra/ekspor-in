const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api-proxy";

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    // Jika response bukan JSON (misal: error 500 dari Next.js proxy "Internal Server Error")
    data = { message: await response.text() || "Terjadi kesalahan pada server" };
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) =>
    fetcher(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, body: any, options?: RequestInit) =>
    fetcher(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) =>
    fetcher(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint: string, body?: any, options?: RequestInit) =>
    fetcher(endpoint, { 
      ...options, 
      method: "DELETE", 
      ...(body ? { body: JSON.stringify(body) } : {}) 
    }),
};
