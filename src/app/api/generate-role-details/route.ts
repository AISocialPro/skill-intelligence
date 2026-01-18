import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { roleTitle, domain } = await req.json();

  // Mock AI generation for details
  const skills = [
    { id: "s1", skill_name: "Data Analysis", weight: 5, category: "technical", required_level: 4 },
    { id: "s2", skill_name: `${domain} Domain Knowledge`, weight: 5, category: "domain", required_level: 4 },
    { id: "s3", skill_name: "Project Management", weight: 3, category: "soft", required_level: 3 },
    { id: "s4", skill_name: "Technical Communication", weight: 4, category: "soft", required_level: 4 },
    { id: "s5", skill_name: "Regulatory Compliance", weight: 4, category: "domain", required_level: 3 },
  ];

  const tools = ["Jira", "Tableau", "Python", "Excel", "PowerBI"];

  const projects = [
    {
      id: "p1",
      title: `${domain} Optimization Analysis`,
      description: `Analyze ${domain} processes to identify inefficiencies.`,
      difficulty: "intermediate",
      estimated_time: "40h",
      skills_developed: ["Data Analysis", "Process Optimization"]
    },
    {
      id: "p2",
      title: "Strategic Implementation Plan",
      description: "Develop a strategy for new tech adoption.",
      difficulty: "advanced",
      estimated_time: "60h",
      skills_developed: ["Strategy", "Planning"]
    }
  ];

  const certs = [`Certified ${domain} Professional`, "PMP"];

  return NextResponse.json({ skills, tools, projects, certs });
}
