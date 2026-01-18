import { supabaseBrowser } from "@/lib/supabaseBrowser";

export async function completeOnboarding({
  domain,
  role,
  level,
}: {
  domain: "healthcare" | "agritech" | "smart-city";
  role: string;
  level: "beginner" | "intermediate" | "advanced";
}) {
  const supabase = supabaseBrowser();

  // ✅ Ensure session exists
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Not logged in. Please login again.");

  const userId = user.id;

  // ✅ 1) Track selection UPSERT
  const { error: trackError } = await supabase
    .from("user_track_selection")
    .upsert(
      {
        user_id: userId,
        domain,
        role,
        level,
      },
      { onConflict: "user_id" }
    );

  if (trackError) throw trackError;

  // ✅ 2) Profile UPSERT (safe columns)
  const fullName =
  user.user_metadata?.full_name ||
  user.user_metadata?.name ||
  (user.email ? user.email.split("@")[0] : "User");

const { error: profileError } = await supabase
  .from("user_profile")
  .upsert(
    {
      user_id: userId,
      email: user.email ?? "",
      full_name: fullName,   // ✅ never blank now
      bio: "Excited to start my learning journey!",
      location: "",
    },
    { onConflict: "user_id" }
  );


  if (profileError) throw profileError;

  // ✅ 3) Starter skills insert (no delete; just insert if not exists)
  const starterSkills = getStarterSkills(domain);

  const skillRows = starterSkills.map((skill) => ({
    user_id: userId,
    name: skill,
    level: level === "beginner" ? 1 : level === "intermediate" ? 3 : 4,
    domain: "common", // keep common so it passes your schema
    confidence_score: 20,
  }));

  const { error: skillsError } = await supabase
    .from("user_skills")
    .insert(skillRows);

  // If duplicate insert happens, it may error. For now show real error.
  if (skillsError) throw skillsError;

  return true;
}

function getStarterSkills(domain: string): string[] {
  const base = [
    "Data Analysis Fundamentals",
    "Problem Solving",
    "Communication Skills",
  ];

  const domainSkills: Record<string, string[]> = {
    healthcare: [
      "Medical Terminology",
      "Healthcare Regulations",
      "Patient Data Privacy",
    ],
    agritech: [
      "Agricultural Science Basics",
      "Sustainability Principles",
      "Precision Agriculture",
    ],
    "smart-city": ["Urban Planning Basics", "IoT Fundamentals", "Public Infrastructure"],
  };

  return [...base, ...(domainSkills[domain] || [])];
}
