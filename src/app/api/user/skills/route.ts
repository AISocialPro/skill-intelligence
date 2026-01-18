// app/api/user/skills/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();

  const skills = await db.query(`
    select 
      us.skill_name as name,
      us.level,
      coalesce(
        json_agg(usev.evidence) filter (where usev.evidence is not null),
        '[]'
      ) as evidence
    from user_skills us
    left join user_skill_evidence usev on usev.user_skill_id = us.id
    where us.user_id = $1
    group by us.skill_name, us.level
  `, [user.id]);

  return NextResponse.json(skills.rows);
}
