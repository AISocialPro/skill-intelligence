// app/api/assessment/history/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();

  const history = await db.query(`
    select 
      readiness_score as "readinessScore",
      result->'skillRadar' as "skillRadar",
      result->'missingSkills' as "missingSkills",
      result->'weakSkills' as "weakSkills",
      result->'suggestedActions' as "suggestedActions",
      result->>'explanation' as explanation,
      created_at as timestamp
    from skill_assessments
    where user_id = $1
    order by created_at desc
    limit 5
  `, [user.id]);

  return NextResponse.json(history.rows);
}
