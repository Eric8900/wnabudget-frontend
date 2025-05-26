'use client';
import { User } from "@/models/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
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

export async function isAuthenticated(): Promise<boolean> {
  const token = getAccessToken();
  const userId = getUserId();
  if (!token || !userId || userId == null) return false;

  try {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status === 200;
  } catch {
    return false;
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
  const token = getAccessToken();
  const userId = getUserId();

  if (!token || !userId || userId == null) return null;

  const res = await fetch(`${API_BASE}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

const user: User = await res.json();
const { id, email, auth_provider } = user;
return { id, email, auth_provider } as User;
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

export async function deleteCurrentUser(): Promise<void> {
  const token = getAccessToken();
  const userId = getUserId();

  if (!token || !userId) return;

  await fetch(`${API_BASE}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}