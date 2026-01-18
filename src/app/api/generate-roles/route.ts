import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { domain } = await req.json();
  
  // Mock AI response - in production this would call OpenAI/Gemini
  const roles = [
    {
      id: `${domain}-analyst`,
      title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Data Analyst`,
      level: "mid",
      description: `Analyze data trends and patterns in the ${domain} sector to drive decision making.`,
      average_salary: "$85,000 - $110,000",
      growth_rate: 12,
      demand: "high"
    },
    {
      id: `${domain}-specialist`,
      title: `Senior ${domain.charAt(0).toUpperCase() + domain.slice(1)} Specialist`,
      level: "senior",
      description: `Lead projects and provide expert consultation in ${domain} technologies.`,
      average_salary: "$110,000 - $140,000",
      growth_rate: 15,
      demand: "high"
    },
    {
      id: `${domain}-researcher`,
      title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Researcher`,
      level: "entry",
      description: `Conduct fundamental research and data collection for ${domain} initiatives.`,
      average_salary: "$60,000 - $80,000",
      growth_rate: 8,
      demand: "medium"
    },
    {
      id: `${domain}-manager`,
      title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Project Manager`,
      level: "lead",
      description: `Oversee cross-functional teams delivering ${domain} solutions.`,
      average_salary: "$120,000 - $160,000",
      growth_rate: 10,
      demand: "high"
    },
    {
      id: `${domain}-consultant`,
      title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Strategy Consultant`,
      level: "senior",
      description: `Advise organizations on ${domain} adoption and optimization.`,
      average_salary: "$115,000 - $150,000",
      growth_rate: 14,
      demand: "medium"
    }
  ];

  return NextResponse.json({ roles });
}
