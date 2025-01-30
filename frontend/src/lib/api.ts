// src/lib/api.ts
export async function apiRequest(
  endpoint: string,
  { method = "GET", headers = {}, body }: RequestInit = {}
): Promise<any> {
  const BASE_URL = "http://localhost:8000/api";
  const token = localStorage.getItem("token");

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    console.error(`Erro ao chamar API: ${response.status} - ${response.statusText}`);
    const errorData = await response.json();
    throw new Error(errorData.message || `Erro ao chamar a API: ${response.status}`);
  }

  return response.json();
}
