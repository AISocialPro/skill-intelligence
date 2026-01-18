import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function serverUserClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const token = auth.replace("Bearer ", "");
  const supabase = serverUserClient(token);

  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const userId = user.id;
  const name = (user.user_metadata?.full_name || user.email || "User") as string;

  const { data: prof } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();

  if (!prof) {
    await supabase.from("profiles").insert({
      id: userId,
      name,
      role: "Frontend Developer",
      level: "Intermediate",
      join_date: new Date().toISOString().slice(0, 10),
      readiness_score: 78,
    });

    await supabase.from("completion_stats").insert({ user_id: userId, courses: 12, projects: 8, assessments: 5 });

    await supabase.from("skill_progress_points").insert([
      { user_id: userId, month: "Jan", score: 45 },
      { user_id: userId, month: "Feb", score: 58 },
      { user_id: userId, month: "Mar", score: 65 },
      { user_id: userId, month: "Apr", score: 72 },
      { user_id: userId, month: "May", score: 78 },
    ]);

    await supabase.from("career_path_steps").insert([
      { user_id: userId, step_order: 1, title: "Beginner Fundamentals", status: "completed", progress: 100 },
      { user_id: userId, step_order: 2, title: "Core Concepts", status: "completed", progress: 100 },
      { user_id: userId, step_order: 3, title: "Intermediate Projects", status: "in_progress", progress: 75 },
      { user_id: userId, step_order: 4, title: "Advanced Topics", status: "upcoming", progress: 0 },
      { user_id: userId, step_order: 5, title: "Job Ready", status: "upcoming", progress: 0 },
    ]);

    await supabase.from("action_items").insert([
      { user_id: userId, title: "Complete React Hooks Course", due: "Today", priority: "high" },
      { user_id: userId, title: "Submit Portfolio Project", due: "Tomorrow", priority: "medium" },
      { user_id: userId, title: "Practice Algorithm Challenges", due: "In 3 days", priority: "medium" },
      { user_id: userId, title: "Attend Webinar: Advanced State Management", due: "This week", priority: "low" },
    ]);

    await supabase.from("badges").insert([
      { user_id: userId, name: "Quick Learner", icon: "🚀", earned: "2024-03-15", description: "Complete 5 courses in one month" },
      { user_id: userId, name: "Project Master", icon: "🏆", earned: "2024-04-10", description: "Successfully complete 3 projects" },
      { user_id: userId, name: "Consistency King", icon: "👑", earned: "2024-05-01", description: "30-day learning streak" },
      { user_id: userId, name: "Assessment Pro", icon: "📊", earned: "2024-05-20", description: "Score above 80% on all assessments" },
    ]);
  }

  return NextResponse.json({ ok: true });
}
