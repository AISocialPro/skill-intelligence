// app/api/assessment/run/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { runGapAnalysis } from "@/lib/assessment";

export async function POST(req: Request) {
  const { trackId } = await req.json();
  const user = await getUser();

  const track = await db.query(`
    select 
      ct.id, ct.name,
      json_agg(
        json_build_object(
          'name', ts.skill_name,
          'level', ts.required_level,
          'weight', ts.weight
        )
      ) as requiredSkills
    from career_tracks ct
    join track_skills ts on ts.track_id = ct.id
    where ct.id = $1
    group by ct.id
  `, [trackId]);

  const skills = await db.query(`
    select skill_name as name, level
    from user_skills
    where user_id = $1
  `, [user.id]);

  const result = runGapAnalysis(track.rows[0], skills.rows);

  await db.query(`
    insert into skill_assessments (user_id, track_id, readiness_score, result)
    values ($1, $2, $3, $4)
  `, [user.id, trackId, result.readinessScore, result]);

  return NextResponse.json(result);
}
