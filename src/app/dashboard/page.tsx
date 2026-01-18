"use client";
import <NavBar />
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth/login");
        return;
      }
      setEmail(data.user.email ?? null);
    };
    checkUser();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-center justify-between rounded-2xl border p-4 shadow">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-600">Logged in as: {email ?? "..."}</p>
          </div>
          <button onClick={logout} className="rounded-xl border px-4 py-2">
            Logout
          </button>
        </div>

        <div className="rounded-2xl border p-6">
          <p className="text-gray-700">
            Day 1 complete ✅ Next we’ll build Profile module: skills, courses, projects, achievements.
          </p>
        </div>
      </div>
    </div>
  );
}
