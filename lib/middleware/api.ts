import { getAccessToken } from "./auth";

type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
  auth?: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers && typeof options.headers === "object" && !Array.isArray(options.headers)) ? options.headers : {}),
  };

  if (options.auth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }

  return res.json();
}

export const api = {
  get: <T>(url: string, auth = true) => request<T>(url, { method: "GET", auth }),
  post: <T>(url: string, data: unknown, auth = true) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
      auth,
    }),
  put: <T>(url: string, data: unknown, auth = true) =>
    request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      auth,
    }),
  delete: <T>(url: string, auth = true) => request<T>(url, { method: "DELETE", auth }),
  patch: <T>(url: string, data: unknown, auth = true) =>
    request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
      auth,
    }),
};