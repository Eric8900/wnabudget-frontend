const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getUserId(): string | null {
  return localStorage.getItem("user_id");
}

export function setAuth(token: string, userId: string) {
  localStorage.setItem("access_token", token);
  localStorage.setItem("user_id", userId);
}

export function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  const userId = getUserId();
  if (!token || !userId) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

interface AuthResponse {
  token: string;
  user_id: string;
}

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Login failed");
  }

  const { token, user_id }: AuthResponse = await res.json();
  setAuth(token, user_id);
}

export async function signup(email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Signup failed");
  }
}