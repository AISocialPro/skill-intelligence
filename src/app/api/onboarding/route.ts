import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* 🔑 Supabase client — SAME FILE */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* 🧠 POST: Save onboarding data */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      domain,
      role,
      skillLevel,
      skills,
    } = body;

    /* ❌ Safety check */
    if (!user_id || !domain || !role || !skillLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ✅ Insert realtime-safe data */
    const { error } = await supabase.from("profiles").insert({
      user_id,
      domain,
      role,
      skill_level: skillLevel,
      skills,
      progress: {
        coursesCompleted: 0,
        projectsDone: 0,
        hoursLearned: 0,
        currentStreak: 0,
      },
      goals: [
        "Complete first course",
        "Build first project",
        "Connect with a mentor",
      ],
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* 🧠 GET: Fetch profile (Realtime friendly) */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
