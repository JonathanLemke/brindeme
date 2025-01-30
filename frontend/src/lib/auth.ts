// src/lib/auth.ts
import { apiRequest } from "./api";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function login(email: string, password: string) {
  const data = await apiRequest("/login", {
    method: "POST",
    body: { email, password },
  });
  return data;
}

export async function register(userData: RegisterData) {
  const data = await apiRequest("/register", {
    method: "POST",
    body: userData,
  });
  return data;
}
