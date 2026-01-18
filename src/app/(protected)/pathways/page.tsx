"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Briefcase,
  Wrench,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  CheckCircle,
  Filter,
  Download,
  Share2,
  DollarSign,
  Clock,
  Code,
  RefreshCw,
} from "lucide-react";

type DomainId = "healthcare" | "agriculture" | "urban" | "tech";
type RoleLevel = "entry" | "mid" | "senior" | "lead";
type Demand = "high" | "medium" | "low";
type SkillCategory = "technical" | "domain" | "soft" | "tools";

type DomainRow = {
  id: DomainId;
  name: string;
  description: string | null;
  roles_count: number | null;
};

type RoleRow = {
  id: string;
  domain_id: DomainId;
  title: string;
  level: RoleLevel;
  description: string | null;
  average_salary: string | null;
  growth_rate: number | null;
  demand: Demand;
};

type RoleSkillRow = {
  id: string;
  role_id: string;
  skill_key: string;
  skill_name: string;
  weight: number;
  category: SkillCategory;
  required_level: number;
};

type RoleProjectRow = {
  id: string;
  role_id: string;
  title: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_time: string | null;
  github_link: string | null;
  skills_developed: string[] | null;
};

const getDomainStyle = (id: string) => {
  const normalizedId = id.toLowerCase();
  if (normalizedId.includes("health")) return { gradient: "from-red-500 to-pink-500", bg: "bg-red-50", text: "text-red-700" };
  if (normalizedId.includes("agri")) return { gradient: "from-green-500 to-emerald-500", bg: "bg-green-50", text: "text-green-700" };
  if (normalizedId.includes("urban") || normalizedId.includes("city")) return { gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-700" };
  // Default/Tech
  return { gradient: "from-purple-500 to-violet-500", bg: "bg-purple-50", text: "text-purple-700" };
};

function getLevelColor(level: RoleLevel) {
  switch (level) {
    case "entry": return "bg-green-100 text-green-800";
    case "mid": return "bg-blue-100 text-blue-800";
    case "senior": return "bg-purple-100 text-purple-800";
    case "lead": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getDemandColor(demand: Demand) {
  switch (demand) {
    case "high": return "bg-red-100 text-red-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    case "low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getCategoryColor(category: SkillCategory) {
  switch (category) {
    case "technical": return "bg-blue-100 text-blue-800";
    case "domain": return "bg-green-100 text-green-800";
    case "soft": return "bg-purple-100 text-purple-800";
    case "tools": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default function CareerPathwaysPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<DomainId>("healthcare");

  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const [roleSkills, setRoleSkills] = useState<RoleSkillRow[]>([]);
  const [roleTools, setRoleTools] = useState<string[]>([]);
  const [roleProjects, setRoleProjects] = useState<RoleProjectRow[]>([]);
  const [roleCerts, setRoleCerts] = useState<string[]>([]);

  const [userSkills, setUserSkills] = useState<Record<string, number>>({});
  const [showComparison, setShowComparison] = useState(true);

  const [showLearningPath, setShowLearningPath] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [roadmapText, setRoadmapText] = useState<string>("");
  const [isGeneratingRoles, setIsGeneratingRoles] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // auth + initial loads
  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      const supabase = supabaseBrowser();

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/auth/login");
        return;
      }

      // 1) load domains
      const domainsRes = await supabase
        .from("career_domains")
        .select("*")
        .order("name", { ascending: true });

      if (domainsRes.error) {
        alert(domainsRes.error.message);
        setLoading(false);
        return;
      }

      const d = (domainsRes.data || []) as DomainRow[];
      setDomains(d);

      const firstDomain = (d[0]?.id as DomainId) || "healthcare";
      setSelectedDomain(firstDomain);

      // 2) load user skills (real)
      // Prefer skill_key if exists, else fallback to name-normalized keys
      const skillsRes = await supabase
        .from("user_skills")
        .select("skill_key, name, level")
        .eq("user_id", auth.user.id);

      if (skillsRes.error) {
        // RLS issue will show here
        alert(skillsRes.error.message);
        setLoading(false);
        return;
      }

      const map: Record<string, number> = {};
      (skillsRes.data || []).forEach((s: any) => {
        const key = (s.skill_key || s.name || "").toString().trim().toLowerCase();
        if (key) map[key] = s.level ?? 1;
      });
      setUserSkills(map);

      setLoading(false);
    };

    boot();
  }, [router]);

  // load roles by domain
  useEffect(() => {
    const loadRoles = async () => {
      const supabase = supabaseBrowser();

      const res = await supabase
        .from("career_roles")
        .select("*")
        .eq("domain_id", selectedDomain)
        .order("title", { ascending: true });

      if (res.error) {
        alert(res.error.message);
        return;
      }

      const data = (res.data || []) as RoleRow[];
      setRoles(data);

      const firstRoleId = data[0]?.id || "";
      setSelectedRoleId(firstRoleId);
    };

    if (selectedDomain) loadRoles();
  }, [selectedDomain]);

  // load role details
  useEffect(() => {
    const loadRoleDetails = async () => {
      if (!selectedRoleId) {
        setRoleSkills([]);
        setRoleTools([]);
        setRoleProjects([]);
        setRoleCerts([]);
        return;
      }

      const supabase = supabaseBrowser();

      const [skillsRes, toolsRes, projectsRes, certsRes] = await Promise.all([
        supabase.from("career_role_skills").select("*").eq("role_id", selectedRoleId).order("weight", { ascending: false }),
        supabase.from("career_role_tools").select("tool").eq("role_id", selectedRoleId),
        supabase.from("career_role_projects").select("*").eq("role_id", selectedRoleId),
        supabase.from("career_role_certifications").select("certification").eq("role_id", selectedRoleId),
      ]);

      if (skillsRes.data && skillsRes.data.length > 0) {
        setRoleSkills((skillsRes.data || []) as RoleSkillRow[]);
        setRoleTools((toolsRes.data || []).map((t: any) => t.tool));
        setRoleProjects((projectsRes.data || []) as RoleProjectRow[]);
        setRoleCerts((certsRes.data || []).map((c: any) => c.certification));
      } else {
        // If DB is empty for this role, try to generate details via API
        const role = roles.find(r => r.id === selectedRoleId);
        if (role) {
          const genRes = await fetch("/api/generate-role-details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roleTitle: role.title, domain: role.domain_id }),
          });
          const genData = await genRes.json();
          setRoleSkills(genData.skills || []);
          setRoleTools(genData.tools || []);
          setRoleProjects(genData.projects || []);
          setRoleCerts(genData.certs || []);
        }
      }
    };

    loadRoleDetails();
  }, [selectedRoleId]);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) || null,
    [roles, selectedRoleId]
  );

  const currentDomain = useMemo(
    () => domains.find((d) => d.id === selectedDomain) || null,
    [domains, selectedDomain]
  );

  const match = useMemo(() => {
    if (!selectedRole || roleSkills.length === 0) return 0;

    const totalWeight = roleSkills.reduce((sum, s) => sum + (s.weight || 0), 0) || 1;
    let score = 0;

    roleSkills.forEach((s) => {
      const key = (s.skill_key || s.skill_name).toLowerCase();
      const userLevel = userSkills[key] || 1;
      const required = s.required_level || 1;
      score += ((Math.min(userLevel, required) / required) * (s.weight || 0));
    });

    return Math.round((score / totalWeight) * 100);
  }, [selectedRole, roleSkills, userSkills]);

  const calculateGap = (s: RoleSkillRow) => {
    const key = (s.skill_key || s.skill_name).toLowerCase();
    const userLevel = userSkills[key] || 1;
    return Math.max(0, (s.required_level || 1) - userLevel);
  };

  // Update skill level in DB (real-time)
  const handleSkillChange = async (skillKey: string, skillName: string, level: number) => {
    const supabase = supabaseBrowser();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return router.push("/auth/login");

    const key = (skillKey || skillName).toLowerCase();

    // update UI instantly
    setUserSkills((prev) => ({ ...prev, [key]: level }));

    // upsert into user_skills (requires your user_skills has skill_key column, but will still work without it)
    // If skill_key column doesn't exist, remove skill_key field below.
    const payload: any = {
      user_id: auth.user.id,
      name: skillName,
      level,
      confidence_score: Math.min(100, level * 20),
      last_updated: new Date().toISOString(),
    };

    // include if your DB has it
    payload.skill_key = key;

    const res = await supabase.from("user_skills").upsert(payload, { onConflict: "user_id,skill_key" as any });
    if (res.error) {
      // fallback: if you don't have (user_id,skill_key) unique constraint, do a simpler upsert by inserting without conflict
      // show error for now
      console.log("skill update error", res.error);
    }
  };

  const exportSkillGapReport = () => {
    if (!selectedRole || roleSkills.length === 0) {
      alert("No role selected / no skills found.");
      return;
    }

    // Generate a readable text report
    let report = `SKILL GAP REPORT\n`;
    report += `================================\n`;
    report += `Role: ${selectedRole.title}\n`;
    report += `Domain: ${currentDomain?.name}\n`;
    report += `Match Score: ${match}%\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    report += `SKILL BREAKDOWN:\n`;
    report += `--------------------------------\n`;
    roleSkills.forEach(s => {
      const key = (s.skill_key || s.skill_name).toLowerCase();
      const userLevel = userSkills[key] || 1;
      const gap = calculateGap(s);
      report += `- ${s.skill_name}: Current ${userLevel} / Required ${s.required_level} -> ${gap === 0 ? 'Met' : `Gap of ${gap} levels`}\n`;
    });

    report += `\nRECOMMENDED ACTIONS:\n`;
    report += `--------------------------------\n`;
    report += `1. Focus on high-weight skills first.\n`;
    report += `2. Complete recommended projects in the dashboard.\n`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skill-gap-${selectedRole.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateRoadmap = async () => {
    if (!selectedRole || roleSkills.length === 0) {
      alert("No role selected / no skills found.");
      return;
    }

    setIsGeneratingRoadmap(true);

    const gaps = roleSkills
      .map((s) => {
        const key = (s.skill_key || s.skill_name).toLowerCase();
        const userLevel = userSkills[key] || 1;
        return {
          skillName: s.skill_name,
          userLevel,
          requiredLevel: s.required_level,
          gap: Math.max(0, s.required_level - userLevel),
          weight: s.weight,
        };
      })
      .sort((a, b) => (b.gap * b.weight) - (a.gap * a.weight));

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleTitle: selectedRole.title, gaps }),
      });

      const data = await res.json();
      setRoadmapText(data.roadmap || "No roadmap generated.");
      setShowRoadmap(true);
    } catch (error) {
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleViewLearningPath = () => {
    // Redirect to recommendations page which serves as the learning path view
    router.push(`/recommendations?role=${selectedRoleId}`);
  };

  const handleGenerateRoles = async () => {
    setIsGeneratingRoles(true);
    try {
      const res = await fetch("/api/generate-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain }),
      });
      const data = await res.json();
      setRoles(data.roles.map((r: any) => ({ ...r, domain_id: selectedDomain })));
      if (data.roles.length > 0) setSelectedRoleId(data.roles[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingRoles(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pathways...</p>
        </div>
      </div>
    );
  }

  if (!currentDomain) {
    return (
      <div className="min-h-screen p-10">
        <h1 className="text-xl font-semibold">No domains found</h1>
        <p className="text-gray-600 mt-2">Please seed career_domains and career_roles tables.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 rotate-180 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Career Pathways</h1>
                  <p className="text-sm text-gray-500">Explore roles & requirements</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Career Pathways Explorer</h2>
              <p className="text-gray-600 mt-2">Domain-specific career tracks with skill frameworks</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-full">
                  Skill Quest
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-full">
                  DB-driven frameworks
                </div>
              </div>
            </div>

            {selectedRole && (
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-sm text-gray-600">Your Match Score</p>
                <div className="flex items-center justify-end">
                  <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{match}%</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">for {selectedRole.title}</p>
                    <div className="text-sm font-medium">
                      {match >= 70 ? (
                        <span className="text-green-600">Strong Match</span>
                      ) : match >= 40 ? (
                        <span className="text-yellow-600">Moderate Match</span>
                      ) : (
                        <span className="text-red-600">Needs Development</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Domain selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Domain Track</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((d) => {
              const isSelected = d.id === selectedDomain;
              const ui = getDomainStyle(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isSelected
                      ? `border-transparent bg-gradient-to-br ${ui.gradient} text-white shadow-lg transform scale-[1.02]`
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-left">
                    <h4 className={`font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}>{d.name}</h4>
                    <p className={`text-sm mt-1 ${isSelected ? "text-white/90" : "text-gray-600"}`}>
                      {d.description || ""}
                    </p>
                    <div className="flex items-center mt-3">
                      <Users className={`h-4 w-4 mr-1 ${isSelected ? "text-white/80" : "text-gray-400"}`} />
                      <span className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                        {d.roles_count ?? roles.length} career paths
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Role selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Available Roles in {currentDomain.name}</h3>
                  <p className="text-sm text-gray-500">Select a role to view requirements</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="border border-gray-300 rounded-xl px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {roles.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">No roles found for this domain.</p>
                  <button
                    onClick={handleGenerateRoles}
                    disabled={isGeneratingRoles}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center mx-auto"
                  >
                    {isGeneratingRoles ? <RefreshCw className="animate-spin h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Generate Roles with AI
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoleId(r.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRoleId === r.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{r.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(r.level)}`}>
                            {r.level.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDemandColor(r.demand)}`}>
                            {r.demand.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {selectedRoleId === r.id && <CheckCircle className="h-5 w-5 text-blue-600" />}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{r.description || ""}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {r.average_salary || "—"}
                      </div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +{r.growth_rate ?? 0}% growth
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill framework */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Skill Framework for {selectedRole?.title || "Role"}
                  </h3>
                  <p className="text-sm text-gray-500">Required skills with importance weights (1–5)</p>
                </div>
                <div className="flex items-center space-x-4">
                  {showComparison ? (
                    <button
                      onClick={() => setShowComparison(false)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      Hide Comparison
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowComparison(true)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      Show Comparison
                    </button>
                  )}
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <div className="space-y-6">
                {roleSkills.map((s) => {
                  const key = (s.skill_key || s.skill_name).toLowerCase();
                  const userLevel = userSkills[key] || 1;
                  const gap = calculateGap(s);

                  return (
                    <div key={s.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {s.weight}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{s.skill_name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(s.category)}`}>
                              {s.category.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${gap === 0 ? "text-green-600" : gap <= 2 ? "text-yellow-600" : "text-red-600"}`}>
                            Gap: {gap} level{gap !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      {showComparison && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Your Level</span>
                                <span className="font-medium">{userLevel}/5</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${(userLevel / 5) * 100}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Required Level</span>
                                <span className="font-medium">{s.required_level}/5</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${(s.required_level / 5) * 100}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Adjust your level:</span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((lvl) => (
                                <button
                                  key={lvl}
                                  onClick={() => handleSkillChange(s.skill_key, s.skill_name, lvl)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    userLevel >= lvl
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Projects & tools */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sample Projects & Tools</h3>
                  <p className="text-sm text-gray-500">Hands-on projects and tools used in this role</p>
                </div>
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                    Recommended Projects
                  </h4>

                  <div className="space-y-4">
                    {roleProjects.map((p) => (
                      <div key={p.id} className="p-4 border border-gray-200 rounded-xl">
                        <h5 className="font-medium text-gray-900 mb-2">{p.title}</h5>
                        <p className="text-sm text-gray-600 mb-3">{p.description || ""}</p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={`px-2 py-1 rounded-full ${
                              p.difficulty === "beginner" ? "bg-green-100 text-green-800" :
                              p.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {p.difficulty}
                            </span>

                            <span className="text-gray-600 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {p.estimated_time || "—"}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(p.skills_developed || []).map((s, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {s}
                              </span>
                            ))}
                          </div>

                          {p.github_link && (
                            <a
                              href={p.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                              <Code className="h-4 w-4 mr-1" />
                              View Template
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Wrench className="h-5 w-5 text-green-600 mr-2" />
                    Essential Tools & Certifications
                  </h4>

                  <div className="space-y-3">
                    {roleTools.map((t, i) => (
                      <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                          {i + 1}
                        </div>
                        <span className="font-medium text-gray-900">{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="h-5 w-5 text-purple-600 mr-2" />
                      Certification Paths
                    </h4>

                    <div className="space-y-2">
                      {roleCerts.map((c, i) => (
                        <div key={i} className="flex items-center p-3 border border-purple-100 bg-purple-50 rounded-lg">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                            {i + 1}
                          </div>
                          <span className="text-sm text-gray-700">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Match Insights</h3>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Match Score: {match}%</p>
                      <p className="text-sm text-gray-600">
                        {match >= 70 ? "Strong alignment with role requirements" :
                         match >= 40 ? "Moderate alignment – some gaps to fill" :
                         "Significant skill gaps – focus on development"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Top Skill Gaps</h4>
                  <div className="space-y-2">
                    {roleSkills
                      .filter((s) => calculateGap(s) > 0)
                      .sort((a, b) => (calculateGap(b) * b.weight) - (calculateGap(a) * a.weight))
                      .slice(0, 3)
                      .map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                          <span className="text-sm text-gray-700">{s.skill_name}</span>
                          <span className="text-sm font-medium text-red-600">
                            Gap: {calculateGap(s)} lvls
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Pathway Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleViewLearningPath}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-3" />
                    <span>View Learning Path</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  onClick={exportSkillGapReport}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <Download className="h-5 w-5 mr-3" />
                    <span>Export Skill Gap Report</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  onClick={generateRoadmap}
                  disabled={isGeneratingRoadmap}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    {isGeneratingRoadmap ? <RefreshCw className="animate-spin h-5 w-5 mr-3" /> : <Sparkles className="h-5 w-5 mr-3" />}
                    <span>{isGeneratingRoadmap ? "Generating..." : "Generate AI Roadmap"}</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {selectedRole && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentDomain.name} Insights</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Average Salary</p>
                      <p className="font-semibold text-gray-900">{selectedRole.average_salary || "—"}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Industry Growth</p>
                      <p className="font-semibold text-gray-900">+{selectedRole.growth_rate ?? 0}% annually</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Demand</p>
                      <p className="font-semibold text-gray-900">{selectedRole.demand.toUpperCase()}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Learning Path Modal */}
      {showLearningPath && selectedRole && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Learning Path: {selectedRole.title}</h3>
              <button onClick={() => setShowLearningPath(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-lg">✕</span>
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Recommended projects & certifications based on your selected role.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Projects</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {roleProjects.map(p => <li key={p.id}>{p.title}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">Certifications</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {roleCerts.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Modal */}
      {showRoadmap && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">AI Roadmap</h3>
              <button onClick={() => setShowRoadmap(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-lg">✕</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono">
              {roadmapText}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowRoadmap(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
