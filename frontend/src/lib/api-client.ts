const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api-proxy";

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // Set Content-Type to application/json by default unless body is FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = { message: text || "Terjadi kesalahan pada server" };
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
    fetcher(endpoint, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) =>
    fetcher(endpoint, { ...options, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (endpoint: string, body?: any, options?: RequestInit) =>
    fetcher(endpoint, {
      ...options,
      method: "DELETE",
      ...(body ? { body: JSON.stringify(body) } : {})
    }),
};
