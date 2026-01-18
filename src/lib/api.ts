import { getAccessToken } from "./getAccessToken";

async function withAuthHeaders(extra?: Record<string, string>) {
  const token = await getAccessToken();
  if (!token) throw new Error("Not logged in");
  return {
    Authorization: `Bearer ${token}`,
    ...(extra || {}),
  };
}

export async function apiGet<T>(url: string): Promise<T> {
  const headers = await withAuthHeaders();
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost<T>(url: string, body?: any): Promise<T> {
  const headers = await withAuthHeaders({ "Content-Type": "application/json" });
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPut<T>(url: string, body?: any): Promise<T> {
  const headers = await withAuthHeaders({ "Content-Type": "application/json" });
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
