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

  const { data: prof } = await supabase.from("profiles").select("readiness_score").eq("id", userId).maybeSingle();
  const prev = prof?.readiness_score ?? 0;
  const newScore = Math.min(100, prev + 2);

  const { data: run, error: runErr } = await supabase
    .from("assessment_runs")
    .insert({ user_id: userId, status: "running", started_at: new Date().toISOString() })
    .select("*")
    .single();

  if (runErr) return NextResponse.json({ error: runErr.message }, { status: 400 });

  await supabase.from("assessment_runs").update({
    status: "completed",
    score: newScore,
    ended_at: new Date().toISOString(),
  }).eq("id", run.id);

  await supabase.from("profiles").update({ readiness_score: newScore }).eq("id", userId);

  const { data: cs } = await supabase.from("completion_stats").select("*").eq("user_id", userId).maybeSingle();
  if (!cs) {
    await supabase.from("completion_stats").insert({ user_id: userId, assessments: 1, courses: 0, projects: 0 });
  } else {
    await supabase.from("completion_stats").update({ assessments: (cs.assessments ?? 0) + 1 }).eq("user_id", userId);
  }

  return NextResponse.json({ ok: true, runId: run.id, score: newScore });
}
