// app/api/tracks/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const tracks = await db.query(`
    select 
      ct.id, ct.name, ct.domain, ct.description,
      json_agg(
        json_build_object(
          'name', ts.skill_name,
          'level', ts.required_level,
          'weight', ts.weight
        )
      ) as requiredSkills
    from career_tracks ct
    join track_skills ts on ts.track_id = ct.id
    group by ct.id
  `);

  return NextResponse.json(tracks.rows);
}
