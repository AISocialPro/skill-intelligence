import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

/* ===============================
   Helpers
================================ */
type Importance = "high" | "medium" | "low";

const getImportance = (weight: number): Importance => {
  if (weight >= 0.12) return "high";
  if (weight >= 0.09) return "medium";
  return "low";
};

/* ===============================
   Core Algorithm
================================ */
function runAssessment(requiredSkills: any[], userSkills: any[]) {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  const skillRadar: any[] = [];
  const missingSkills: string[] = [];
  const weakSkills: string[] = [];

  for (const req of requiredSkills) {
    const userSkill = userSkills.find((u) => u.name === req.skill_name);

    const currentLevel = userSkill?.level ?? 0;
    const requiredLevel = req.required_level;
    const gap = Math.max(0, requiredLevel - currentLevel);

    if (currentLevel === 0) missingSkills.push(req.skill_name);
    else if (gap >= 2) weakSkills.push(req.skill_name);

    const skillScore = Math.min(currentLevel / requiredLevel, 1) * 100;

    totalWeightedScore += skillScore * req.weight;
    totalWeight += req.weight;

    skillRadar.push({
      name: req.skill_name,
      currentLevel,
      requiredLevel,
      gap,
      importance: getImportance(req.weight),
      evidence: userSkill?.evidence ?? [],
    });
  }

  const readinessScore =
    totalWeight === 0 ? 0 : Math.round(totalWeightedScore / totalWeight);

  const explanation =
    readinessScore >= 85
      ? "Excellent readiness with strong skill alignment."
      : readinessScore >= 70
      ? "Good foundation with some gaps to address."
      : readinessScore >= 50
      ? "Basic competency but multiple improvements needed."
      : "Low readiness. Focus on core skills first.";

  const suggestedActions: string[] = [];

  skillRadar
    .filter((s) => s.gap > 0 && s.importance === "high")
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 2)
    .forEach((s) =>
      suggestedActions.push(
        `Improve ${s.name} from level ${s.currentLevel} to ${s.requiredLevel}`
      )
    );

  missingSkills.slice(0, 2).forEach((s) =>
    suggestedActions.push(`Learn ${s} fundamentals through beginner courses`)
  );

  while (suggestedActions.length < 5) {
    suggestedActions.push("Build a hands-on project to strengthen practical skills");
  }

  return {
    readinessScore,
    skillRadar,
    missingSkills,
    weakSkills,
    suggestedActions: suggestedActions.slice(0, 5),
    explanation,
    timestamp: new Date().toISOString(),
  };
}

/* ===============================
   Auth helper
================================ */
async function getAuthedUserId(supabase: any) {
  const { data, error } = await supabase.auth.getUser();
  if (error) return { userId: null, error };
  return { userId: data?.user?.id ?? null, error: null };
}

/* ===============================
   GET Handler
   ?type=tracks | history | skills
================================ */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    // Tracks can be public
    if (type === "tracks") {
      const { data, error } = await supabase
        .from("tracks")
        .select(
          `
          id,
          name,
          domain,
          description,
          track_skills (
            skill_name,
            required_level,
            weight
          )
        `
        );

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch tracks", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        (data || []).map((t: any) => ({
          ...t,
          requiredSkills: (t.track_skills || []).map((s: any) => ({
            name: s.skill_name,
            level: s.required_level,
            weight: s.weight,
          })),
        }))
      );
    }

    // For skills & history, require auth
    if (type === "skills" || type === "history") {
      const { userId, error: authErr } = await getAuthedUserId(supabase);
      if (authErr || !userId) {
        return NextResponse.json(
          { error: "Unauthorized", details: authErr?.message ?? "No session" },
          { status: 401 }
        );
      }

      if (type === "skills") {
        const { data, error } = await supabase
          .from("user_skills")
          .select("name, level, evidence")
          .eq("user_id", userId);

        if (error) {
          return NextResponse.json(
            { error: "Failed to fetch user skills", details: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json(
          (data ?? []).map((s: any) => ({
            name: s.name,
            level: s.level,
            evidence: s.evidence ?? [],
          }))
        );
      }

      if (type === "history") {
        const { data, error } = await supabase
          .from("assessment_results")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          return NextResponse.json(
            { error: "Failed to fetch history", details: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json(
          (data ?? []).map((r: any) => ({
            readinessScore: r.score,
            skillRadar: r.skill_radar,
            missingSkills: r.missing_skills,
            weakSkills: r.weak_skills,
            suggestedActions: r.suggested_actions,
            explanation: r.explanation,
            timestamp: r.created_at,
          }))
        );
      }
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch data", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

/* ===============================
   POST Handler
   Run Assessment
================================ */
export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    // Require auth user
    const { userId, error: authErr } = await getAuthedUserId(supabase);
    if (authErr || !userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: authErr?.message ?? "No session" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const trackId = body?.trackId;

    if (!trackId) {
      return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
    }

    // Fetch user skills
    const { data: userSkills, error: userErr } = await supabase
      .from("user_skills")
      .select("name, level, evidence")
      .eq("user_id", userId);

    if (userErr) {
      return NextResponse.json(
        { error: "Failed to fetch user skills", details: userErr.message },
        { status: 500 }
      );
    }

    // Fetch track skills
    const { data: trackSkills, error: trackErr } = await supabase
      .from("track_skills")
      .select("skill_name, required_level, weight")
      .eq("track_id", trackId);

    if (trackErr) {
      return NextResponse.json(
        { error: "Failed to fetch track skills", details: trackErr.message },
        { status: 500 }
      );
    }

    if (!trackSkills || trackSkills.length === 0) {
      return NextResponse.json(
        { error: "Track has no skills configured" },
        { status: 400 }
      );
    }

    // Run algorithm
    const result = runAssessment(trackSkills, userSkills ?? []);

    // Save result (user_id must match auth.uid() for RLS)
    const { error: saveErr } = await supabase.from("assessment_results").insert({
      user_id: userId,
      track_id: trackId,
      score: result.readinessScore,
      missing_skills: result.missingSkills,
      weak_skills: result.weakSkills,
      explanation: result.explanation,
      skill_radar: result.skillRadar,
      suggested_actions: result.suggestedActions,
    });

    if (saveErr) {
      return NextResponse.json(
        { error: "Failed to save assessment", details: saveErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Assessment failed", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
