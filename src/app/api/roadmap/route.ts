import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { roleTitle, gaps } = body;

  // Simple “AI-like” roadmap without external API (hackathon-safe).
  // Later you can replace with OpenAI/Gemini.
  const topGaps = (gaps || []).slice(0, 5);

  const lines: string[] = [];
  lines.push(`Roadmap for: ${roleTitle}`);
  lines.push("");
  lines.push("Week 1: Fundamentals");
  topGaps.slice(0, 2).forEach((g: any) => {
    lines.push(`- Improve ${g.skillName} from level ${g.userLevel} → ${g.requiredLevel}`);
  });
  lines.push("");
  lines.push("Week 2: Build & Practice");
  lines.push("- Complete 1 mini project related to the role");
  lines.push("- Document progress in Skill Quest profile");
  lines.push("");
  lines.push("Week 3: Real Project");
  topGaps.slice(2, 5).forEach((g: any) => {
    lines.push(`- Practice ${g.skillName} using real datasets / tools`);
  });
  lines.push("");
  lines.push("Week 4: Assessment & Portfolio");
  lines.push("- Re-run assessment");
  lines.push("- Add 1 project + 1 course to portfolio");
  lines.push("- Update achievements/certifications");

  return NextResponse.json({ roadmap: lines.join("\n") });
}
