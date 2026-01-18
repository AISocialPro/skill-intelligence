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

  const [profileRes, compRes, progRes, stepsRes, actionsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("completion_stats").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("skill_progress_points").select("*").eq("user_id", userId),
    supabase.from("career_path_steps").select("*").eq("user_id", userId).order("step_order", { ascending: true }),
    supabase.from("action_items").select("*").eq("user_id", userId),
  ]);

  const profile = profileRes.data;
  const comp = compRes.data;

  const lines: string[] = [];
  lines.push("Section,Key,Value");
  lines.push(`User,Name,${profile?.name ?? "User"}`);
  lines.push(`User,Role,${profile?.role ?? ""}`);
  lines.push(`User,Level,${profile?.level ?? ""}`);
  lines.push(`User,ReadinessScore,${profile?.readiness_score ?? 0}`);
  lines.push(`Completion,Courses,${comp?.courses ?? 0}`);
  lines.push(`Completion,Projects,${comp?.projects ?? 0}`);
  lines.push(`Completion,Assessments,${comp?.assessments ?? 0}`);

  (progRes.data ?? []).forEach((p: any) => lines.push(`SkillProgress,${p.month},${p.score}`));
  (stepsRes.data ?? []).forEach((s: any) => lines.push(`CareerStep,${s.step_order}-${s.title},${s.status}:${s.progress}%`));
  (actionsRes.data ?? []).forEach((a: any) => lines.push(`ActionItem,${a.title},${a.due} (${a.priority}) done=${a.is_done}`));

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="skillquest-progress-report.csv"`,
    },
  });
}
