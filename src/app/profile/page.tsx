"use client";
import NavBar from "@/components/NavBar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-gray-600 mt-2">
          Tomorrow: Add skills, courses, projects, achievements here ✅
        </p>
      </div>
    </div>
  );
}
