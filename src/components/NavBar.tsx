"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="w-full border-b">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href="/dashboard" className="font-semibold">
          Skill Intelligence
        </Link>

        <div className="flex gap-4 items-center text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
          <button onClick={logout} className="rounded-lg border px-3 py-1">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
