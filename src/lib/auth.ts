// src/lib/auth.ts
/**
 * Minimal auth stub.
 * Replace with NextAuth / custom auth later.
 */
export async function getUser() {
  return {
    id: "demo-user",
    name: "Demo User",
    email: "demo@example.com",
  };
}
