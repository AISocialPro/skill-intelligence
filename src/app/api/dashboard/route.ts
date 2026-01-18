import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function serverUserClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const token = auth.replace("Bearer ", "");
  const supabase = serverUserClient(token);

  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const userId = user.id;

  const [profileRes, compRes, progRes, stepsRes, actionsRes, badgesRes, assessRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("completion_stats").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("skill_progress_points").select("month,score,created_at").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("career_path_steps").select("*").eq("user_id", userId).order("step_order", { ascending: true }),
    supabase.from("action_items").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("badges").select("*").eq("user_id", userId).order("earned", { ascending: false }),
    supabase.from("assessment_runs").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1),
  ]);

  const profile = profileRes.data;
  const completion = compRes.data;
  const progression = progRes.data ?? [];
  const steps = stepsRes.data ?? [];
  const actions = actionsRes.data ?? [];
  const badges = badgesRes.data ?? [];
  const latestAssessment = assessRes.data?.[0] ?? null;

  const scores = progression.map((p: any) => p.score);
  const first = scores[0] ?? 0;
  const last = scores[scores.length - 1] ?? profile?.readiness_score ?? 0;
  const overallGrowth = first ? `+${Math.round(((last - first) / first) * 100)}%` : "+0%";

  return NextResponse.json({
    user: {
      name: profile?.name ?? (user.user_metadata?.full_name || "User"),
      role: profile?.role ?? "Frontend Developer",
      level: profile?.level ?? "Intermediate",
      joinDate: profile?.join_date ?? new Date().toISOString().slice(0, 10),
    },
    readinessScore: profile?.readiness_score ?? 0,
    skillProgression: progression.map((p: any) => ({ month: p.month, score: p.score })),
    completed: {
      courses: completion?.courses ?? 0,
      projects: completion?.projects ?? 0,
      assessments: completion?.assessments ?? 0,
    },
    careerPathway: steps.map((s: any) => ({
      id: s.id,
      title: s.title,
      status: s.status === "in_progress" ? "in-progress" : s.status,
      progress: s.progress,
      order: s.step_order,
    })),
    nextActions: actions.map((a: any) => ({
      id: a.id,
      title: a.title,
      due: a.due,
      priority: a.priority,
      isDone: a.is_done,
    })),
    badges: badges.map((b: any) => ({
      id: b.id,
      name: b.name,
      icon: b.icon,
      earned: b.earned,
      description: b.description,
    })),
    progressTrend: {
      weeklyChange: "+12%",
      monthlyChange: "+28%",
      overallGrowth,
    },
    latestAssessment: latestAssessment
      ? { id: latestAssessment.id, status: latestAssessment.status, score: latestAssessment.score }
      : null,
  });
}
