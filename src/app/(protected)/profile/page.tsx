"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  HeartPulse,
  Sprout,
  Building2,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Target,
  Star,
  Users,
  Download,
  Share2,
  ChevronRight,
  Brain,
  User,
  Zap,
  CheckCircle,
  Sparkles,
  BarChart3,
  Calendar,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  Search,
  Filter,
  Upload,
  StarHalf,
  FileText,
  Github,
  ExternalLink,
  Trophy,
  Medal,
  BadgeCheck,
  FileBadge,
  Coffee,
  Settings,
  Bell,
  LogOut,
  ArrowLeft,
} from "lucide-react";

// Domain data with images
const domains = {
  healthcare: {
    id: "healthcare",
    name: "Healthcare Informatics",
    description: "Medical data analysis, patient care optimization, and healthcare technology",
    icon: HeartPulse,
    color: "from-red-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
    image: "/api/placeholder/800/400?text=Healthcare+Informatics",
    roles: {
      "health-1": {
        name: "Clinical Data Analyst",
        description: "Analyze patient data to improve care outcomes",
      },
      "health-2": {
        name: "Health Informatics Specialist",
        description: "Implement and optimize healthcare IT systems",
      },
    },
  },
  agritech: {
    id: "agritech",
    name: "AgriTech",
    description: "Agricultural technology, precision farming, and sustainable food systems",
    icon: Sprout,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    image: "/api/placeholder/800/400?text=AgriTech",
    roles: {
      "agri-1": {
        name: "Precision Agriculture Specialist",
        description: "Optimize farming with data and technology",
      },
      "agri-2": {
        name: "Agricultural Data Scientist",
        description: "Analyze crop data to improve yields",
      },
    },
  },
  "smart-city": {
    id: "smart-city",
    name: "Smart City Systems",
    description: "Urban infrastructure, IoT networks, and sustainable city planning",
    icon: Building2,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    image: "/api/placeholder/800/400?text=Smart+City+Systems",
    roles: {
      "city-1": {
        name: "Urban Data Analyst",
        description: "Optimize city operations with data insights",
      },
      "city-2": {
        name: "Smart Infrastructure Engineer",
        description: "Design and implement connected city systems",
      },
    },
  },
};

// Skill domains
const skillDomains = [
  { id: "common", name: "Common", color: "bg-gray-100 text-gray-700" },
  { id: "healthcare", name: "Healthcare", color: "bg-red-100 text-red-700" },
  { id: "agriculture", name: "Agriculture", color: "bg-green-100 text-green-700" },
  { id: "urban", name: "Urban", color: "bg-blue-100 text-blue-700" },
  { id: "tech", name: "Technology", color: "bg-purple-100 text-purple-700" },
];

// Interfaces
interface Skill {
  id: string;
  name: string;
  level: number; // 0-5
  domain: string;
  evidence: {
    type: 'course' | 'project' | 'certificate' | 'experience';
    title: string;
    link?: string;
    date: string;
  }[];
  confidenceScore: number; // 0-100
  lastUpdated: string;
}

const getInitials = (name?: string) => {
  const n = (name || "").trim();
  if (!n) return "U";
  const parts = n.split(/\s+/);
  return (parts[0]?.[0] || "U").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
};

interface Course {
  id: string;
  title: string;
  provider: string;
  link?: string;
  completionDate: string;
  skills: string[];
  duration?: string;
  certificateId?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  skills: string[];
  githubLink?: string;
  demoLink?: string;
  impactScore: number; // 1-5
  completionDate: string;
}

interface Achievement {
  id: string;
  type: 'certificate' | 'hackathon' | 'internship' | 'award';
  title: string;
  issuer: string;
  date: string;
  proofLink?: string;
  description: string;
  points: number; // For gamification
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<any>(null);
  const [tempData, setTempData] = useState<any>(null);
  
  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);

  // Courses state
  const [courses, setCourses] = useState<Course[]>([]);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // New item forms
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 3,
    domain: "common",
    evidence: [{ type: "course" as const, title: "", date: new Date().toISOString().split('T')[0] }],
  });

  const [newCourse, setNewCourse] = useState<Course>({
    id: "",
    title: "",
    provider: "",
    link: "",
    completionDate: new Date().toISOString().split('T')[0],
    skills: [],
    duration: "",
    certificateId: "",
  });

  const [newProject, setNewProject] = useState<Project>({
    id: "",
    title: "",
    description: "",
    domain: "common",
    skills: [],
    githubLink: "",
    demoLink: "",
    impactScore: 3,
    completionDate: new Date().toISOString().split('T')[0],
  });

  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: "",
    type: "certificate",
    title: "",
    issuer: "",
    date: new Date().toISOString().split('T')[0],
    proofLink: "",
    description: "",
    points: 50,
  });

  // UI states
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [importText, setImportText] = useState("");

  // Load user data
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const supabase = supabaseBrowser();

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes.user) {
        router.push("/auth/login");
        return;
      }

      const userId = userRes.user.id;

      // fetch everything in parallel
      const [
        profileRes,
        trackRes,
        skillsRes,
        coursesRes,
        projectsRes,
        achievementsRes,
      ] = await Promise.all([
        supabase.from("user_profile").select("*").eq("user_id", userId).single(),
        supabase.from("user_track_selection").select("*").eq("user_id", userId).single(),
        supabase.from("user_skills").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("user_courses").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("user_projects").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("user_achievements").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

      if (profileRes.error && profileRes.error.code !== 'PGRST116') console.log("profile error", profileRes.error);
      if (trackRes.error && trackRes.error.code !== 'PGRST116') console.log("track error", trackRes.error);

      // ✅ userData from real DB (no hardcoded)
      const profile = profileRes.data || {};
      const track = trackRes.data || {};

      const metaName =
        userRes.user.user_metadata?.full_name ||
        userRes.user.user_metadata?.name ||
        "";

      const dbName = profile.full_name || "";

      setUserData({
        user_id: userId,
        full_name: dbName || metaName || (userRes.user.email?.split("@")[0] ?? "User"),
        email: profile.email || userRes.user.email || "",
        location: profile.location || "",
        bio: profile.bio || "",
        domain: track.domain || null,
        role: track.role || null,
        level: track.level || null,
        progress: {
          coursesCompleted: coursesRes.data?.length || 0,
          projectsDone: projectsRes.data?.length || 0,
          hoursLearned: 0,
          currentStreak: 0,
        },
        goals: [],
      });

      setTempData({
        full_name: dbName || metaName || (userRes.user.email?.split("@")[0] ?? "User"),
        email: profile.email || userRes.user.email || "",
        location: profile.location || "",
        bio: profile.bio || "",
      });

      // ✅ map DB → UI state
      setSkills(
        (skillsRes.data || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          level: s.level,
          domain: s.domain,
          evidence: [], // (optional: you can store evidence later as JSON)
          confidenceScore: s.confidence_score,
          lastUpdated: s.last_updated,
        }))
      );

      setCourses(
        (coursesRes.data || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          provider: c.provider,
          link: c.link || "",
          completionDate: c.completion_date || "",
          duration: c.duration || "",
          certificateId: c.certificate_id || "",
          skills: c.skills || [],
        }))
      );

      setProjects(
        (projectsRes.data || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          domain: p.domain,
          skills: p.skills || [],
          githubLink: p.github_link || "",
          demoLink: p.demo_link || "",
          impactScore: p.impact_score,
          completionDate: p.completion_date || "",
        }))
      );

      setAchievements(
        (achievementsRes.data || []).map((a: any) => ({
          id: a.id,
          type: a.type,
          title: a.title,
          issuer: a.issuer,
          date: a.date || "",
          proofLink: a.proof_link || "",
          description: a.description || "",
          points: a.points,
        }))
      );

      setIsLoading(false);
    };

    load();
  }, [router]);

  // Calculate confidence score for skills
  const calculateConfidenceScore = (skill: Partial<Skill>): number => {
    let score = 0;
    score += (skill.level || 0) * 10;
    if (skill.evidence) {
      const evidenceCount = skill.evidence.length;
      const evidencePoints = Math.min(evidenceCount * 10, 30);
      score += evidencePoints;
      const evidenceTypes = new Set(skill.evidence.map(e => e.type));
      if (evidenceTypes.size > 1) score += 10;
    }
    return Math.min(score, 100);
  };

  // Render star ratings
  const renderStars = (level: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= level
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({level}/5)</span>
      </div>
    );
  };

  // Skill management
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;

    const supabase = supabaseBrowser();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return router.push("/auth/login");

    const row = {
      user_id: user.id,
      name: newSkill.name,
      level: newSkill.level,
      domain: newSkill.domain,
      confidence_score: calculateConfidenceScore(newSkill),
      last_updated: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("user_skills").insert(row).select("*").single();
    if (error) return alert(error.message);

    setSkills((prev) => [
      {
        id: data.id,
        name: data.name,
        level: data.level,
        domain: data.domain,
        evidence: [],
        confidenceScore: data.confidence_score,
        lastUpdated: data.last_updated,
      },
      ...prev,
    ]);

    setNewSkill({
      name: "",
      level: 3,
      domain: "common",
      evidence: [{ type: "course", title: "", date: new Date().toISOString().split('T')[0] }],
    });
    setIsAddingSkill(false);
  };

  const handleAddCourse = async () => {
    if (!newCourse.title.trim() || !newCourse.provider.trim()) return;

    const supabase = supabaseBrowser();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return router.push("/auth/login");

    const row = {
      user_id: user.id,
      title: newCourse.title,
      provider: newCourse.provider,
      link: newCourse.link,
      completion_date: newCourse.completionDate,
      skills: newCourse.skills,
      duration: newCourse.duration,
      certificate_id: newCourse.certificateId,
    };

    const { data, error } = await supabase.from("user_courses").insert(row).select("*").single();
    if (error) return alert(error.message);

    setCourses((prev) => [
      { ...newCourse, id: data.id },
      ...prev,
    ]);

    setNewCourse({
      id: "",
      title: "",
      provider: "",
      link: "",
      completionDate: new Date().toISOString().split('T')[0],
      skills: [],
      duration: "",
      certificateId: "",
    });
    setIsAddingCourse(false);
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) return;

    const supabase = supabaseBrowser();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return router.push("/auth/login");

    const row = {
      user_id: user.id,
      title: newProject.title,
      description: newProject.description,
      domain: newProject.domain,
      skills: newProject.skills,
      github_link: newProject.githubLink,
      demo_link: newProject.demoLink,
      impact_score: newProject.impactScore,
      completion_date: newProject.completionDate,
    };

    const { data, error } = await supabase.from("user_projects").insert(row).select("*").single();
    if (error) return alert(error.message);

    setProjects((prev) => [
      { ...newProject, id: data.id },
      ...prev,
    ]);

    setNewProject({
      id: "",
      title: "",
      description: "",
      domain: "common",
      skills: [],
      githubLink: "",
      demoLink: "",
      impactScore: 3,
      completionDate: new Date().toISOString().split('T')[0],
    });
    setIsAddingProject(false);
  };

  const handleAddAchievement = async () => {
    if (!newAchievement.title.trim() || !newAchievement.issuer.trim()) return;

    const supabase = supabaseBrowser();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return router.push("/auth/login");

    const row = {
      user_id: user.id,
      type: newAchievement.type,
      title: newAchievement.title,
      issuer: newAchievement.issuer,
      date: newAchievement.date,
      proof_link: newAchievement.proofLink,
      description: newAchievement.description,
      points: newAchievement.points,
    };

    const { data, error } = await supabase.from("user_achievements").insert(row).select("*").single();
    if (error) return alert(error.message);

    setAchievements((prev) => [
      { ...newAchievement, id: data.id },
      ...prev,
    ]);

    setNewAchievement({
      id: "",
      type: "certificate",
      title: "",
      issuer: "",
      date: new Date().toISOString().split('T')[0],
      proofLink: "",
      description: "",
      points: 50,
    });
    setIsAddingAchievement(false);
  };

  const handleDeleteItem = async (type: 'skill' | 'course' | 'project' | 'achievement', id: string) => {
    const supabase = supabaseBrowser();

    const table =
      type === "skill" ? "user_skills" :
      type === "course" ? "user_courses" :
      type === "project" ? "user_projects" :
      "user_achievements";

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return alert(error.message);

    if (type === "skill") setSkills((p) => p.filter((x) => x.id !== id));
    if (type === "course") setCourses((p) => p.filter((x) => x.id !== id));
    if (type === "project") setProjects((p) => p.filter((x) => x.id !== id));
    if (type === "achievement") setAchievements((p) => p.filter((x) => x.id !== id));
  };

  const saveProfile = async () => {
    const supabase = supabaseBrowser();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return router.push("/auth/login");

    const { error } = await supabase.from("user_profile").upsert({
      user_id: user.id,
      full_name: tempData.full_name,
      email: tempData.email,
      bio: tempData.bio,
      location: tempData.location,
    }, { onConflict: "user_id" });

    if (error) return alert(error.message);

    setUserData((p: any) => ({ ...p, ...tempData }));
    setIsEditing(false);
  };

  const currentDomain = domains[userData?.domain as keyof typeof domains];
  const currentRole = currentDomain?.roles[userData?.role];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">SkillIntelligence</h1>
                  <p className="text-sm text-gray-500">Career Profile</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  if (isEditing) {
                    saveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="relative h-48 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h1 className="text-4xl font-bold mb-2">Career Profile</h1>
                <p className="text-blue-100">Track your progress and manage your learning journey</p>
              </div>
            </div>
          </div>

          {/* Profile Avatar */}
          <div className="absolute -bottom-12 left-8 z-30">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg flex items-center justify-center text-white text-4xl font-bold">
                {getInitials(userData?.full_name)}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white rounded-2xl shadow border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userData.progress.coursesCompleted}</p>
                <p className="text-sm text-gray-600">Courses</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-2xl shadow border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userData.progress.projectsDone}</p>
                <p className="text-sm text-gray-600">Projects</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-2xl shadow border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
                <p className="text-sm text-gray-600">Achievements</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-2xl shadow border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{skills.length}</p>
                <p className="text-sm text-gray-600">Skills</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {["overview", "skills", "courses", "projects", "achievements", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Personal Info */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                    {isEditing && (
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Edit Profile
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={tempData.full_name}
                            onChange={(e) => setTempData({ ...tempData, full_name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.full_name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={tempData.email}
                            onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{userData.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        {isEditing ? (
                          <textarea
                            value={tempData.bio}
                            onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-600">{userData.bio}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Career Track</h4>
                            <p className="text-sm text-gray-600">Selected during onboarding</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Domain</p>
                            <p className="font-medium text-gray-900">{currentDomain?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Target Role</p>
                            <p className="font-medium text-gray-900">{currentRole?.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Progress Summary</h4>
                            <p className="text-sm text-gray-600">Your learning journey</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Courses Completed</span>
                            <span className="font-medium text-gray-900">{userData.progress.coursesCompleted}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Projects Done</span>
                            <span className="font-medium text-gray-900">{userData.progress.projectsDone}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Learning Hours</span>
                            <span className="font-medium text-gray-900">{userData.progress.hoursLearned}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Skills Management</h2>
                    <p className="text-gray-600">Add, track, and manage your skills with evidence</p>
                  </div>
                  <button
                    onClick={() => setIsAddingSkill(true)}
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Skill
                  </button>
                </div>

                {/* Add Skill Form */}
                {isAddingSkill && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Add New Skill</h3>
                      <button
                        onClick={() => setIsAddingSkill(false)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skill Name
                        </label>
                        <input
                          type="text"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Python Programming"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skill Level (0-5)
                        </label>
                        <div className="space-y-3">
                          <input
                            type="range"
                            min="0"
                            max="5"
                            value={newSkill.level}
                            onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Beginner</span>
                            {renderStars(newSkill.level)}
                            <span className="text-sm text-gray-500">Expert</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Domain
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {skillDomains.map(domain => (
                            <button
                              key={domain.id}
                              onClick={() => setNewSkill({ ...newSkill, domain: domain.id })}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                newSkill.domain === domain.id
                                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {domain.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Evidence (Optional)
                        </label>
                        <div className="space-y-3">
                          {newSkill.evidence.map((evidence, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <select
                                value={evidence.type}
                                onChange={(e) => {
                                  const updatedEvidence = [...newSkill.evidence];
                                  updatedEvidence[idx].type = e.target.value as any;
                                  setNewSkill({ ...newSkill, evidence: updatedEvidence });
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:text-black"
                              >
                                <option value="course">Course</option>
                                <option value="project">Project</option>
                                <option value="certificate">Certificate</option>
                                <option value="experience">Experience</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Title"
                                value={evidence.title}
                                onChange={(e) => {
                                  const updatedEvidence = [...newSkill.evidence];
                                  updatedEvidence[idx].title = e.target.value;
                                  setNewSkill({ ...newSkill, evidence: updatedEvidence });
                                }}
                               className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:text-black"
                              />
                              <input
                                type="date"
                                value={evidence.date}
                                onChange={(e) => {
                                  const updatedEvidence = [...newSkill.evidence];
                                  updatedEvidence[idx].date = e.target.value;
                                  setNewSkill({ ...newSkill, evidence: updatedEvidence });
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:text-black"
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => setNewSkill({
                              ...newSkill,
                              evidence: [...newSkill.evidence, { type: "course", title: "", date: new Date().toISOString().split('T')[0] }]
                            })}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            + Add more evidence
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => setIsAddingSkill(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddSkill}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
                        >
                          Add Skill
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills List */}
                <div className="grid md:grid-cols-2 gap-6">
                  {skills.map(skill => (
                    <div key={skill.id} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              skillDomains.find(d => d.id === skill.domain)?.color
                            }`}>
                              {skillDomains.find(d => d.id === skill.domain)?.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            {renderStars(skill.level)}
                            <div className="flex items-center">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    skill.confidenceScore >= 80 ? "bg-green-500" :
                                    skill.confidenceScore >= 60 ? "bg-blue-500" :
                                    "bg-yellow-500"
                                  }`}
                                  style={{ width: `${skill.confidenceScore}%` }}
                                />
                              </div>
                              <span className="ml-2 text-sm font-medium">{skill.confidenceScore}%</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem('skill', skill.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {skill.evidence.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Evidence:</p>
                          <div className="space-y-2">
                            {skill.evidence.map((evidence, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <div className="flex items-center space-x-2">
                                  {evidence.type === 'course' && <BookOpen className="h-4 w-4 text-blue-500" />}
                                  {evidence.type === 'project' && <Briefcase className="h-4 w-4 text-green-500" />}
                                  {evidence.type === 'certificate' && <Award className="h-4 w-4 text-purple-500" />}
                                  <span className="text-gray-700">{evidence.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Courses & Certifications</h2>
                    <p className="text-gray-600">Track your completed courses and certifications</p>
                  </div>
                  <button
                    onClick={() => setIsAddingCourse(true)}
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Course
                  </button>
                </div>

                {/* Add Course Form */}
                {isAddingCourse && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Add New Course</h3>
                      <button
                        onClick={() => setIsAddingCourse(false)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Title
                          </label>
                          <input
                            type="text"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Data Science Fundamentals"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provider
                          </label>
                          <input
                            type="text"
                            value={newCourse.provider}
                            onChange={(e) => setNewCourse({ ...newCourse, provider: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Coursera, Udemy"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Link
                          </label>
                          <input
                            type="url"
                            value={newCourse.link}
                            onChange={(e) => setNewCourse({ ...newCourse, link: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/course"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Completion Date
                          </label>
                          <input
                            type="date"
                            value={newCourse.completionDate}
                            onChange={(e) => setNewCourse({ ...newCourse, completionDate: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={newCourse.duration}
                            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 6 weeks, 40 hours"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skills Learned
                          </label>
                          <input
                            type="text"
                            value={newCourse.skills.join(', ')}
                            onChange={(e) => setNewCourse({ ...newCourse, skills: e.target.value.split(', ').filter(s => s.trim()) })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Python, Data Analysis, Statistics"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setIsAddingCourse(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddCourse}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
                      >
                        Add Course
                      </button>
                    </div>
                  </div>
                )}

                {/* Courses List */}
                <div className="space-y-6">
                  {courses.map(course => (
                    <div key={course.id} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  {course.provider}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Completed {new Date(course.completionDate).toLocaleDateString()}
                                </span>
                                {course.duration && (
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {course.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteItem('course', course.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {course.skills.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600 mb-2">Skills Developed:</p>
                              <div className="flex flex-wrap gap-2">
                                {course.skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {course.link && (
                            <div className="mt-4">
                              <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                              >
                                <LinkIcon className="h-4 w-4 mr-1" />
                                View Course
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Projects Portfolio</h2>
                    <p className="text-gray-600">Showcase your projects and their impact</p>
                  </div>
                  <button
                    onClick={() => setIsAddingProject(true)}
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Project
                  </button>
                </div>

                {/* Add Project Form */}
                {isAddingProject && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Add New Project</h3>
                      <button
                        onClick={() => setIsAddingProject(false)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Healthcare Analytics Dashboard"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Domain
                          </label>
                          <select
                            value={newProject.domain}
                            onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="common">Common</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="urban">Urban</option>
                            <option value="tech">Technology</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe your project..."
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GitHub Repository
                          </label>
                          <input
                            type="url"
                            value={newProject.githubLink}
                            onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://github.com/user/repo"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Demo Link
                          </label>
                          <input
                            type="url"
                            value={newProject.demoLink}
                            onChange={(e) => setNewProject({ ...newProject, demoLink: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://demo.example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skills Used
                        </label>
                        <input
                          type="text"
                          value={newProject.skills.join(', ')}
                          onChange={(e) => setNewProject({ ...newProject, skills: e.target.value.split(', ').filter(s => s.trim()) })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Python, Data Visualization, SQL"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Impact Score (1-5)
                        </label>
                        <div className="space-y-3">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={newProject.impactScore}
                            onChange={(e) => setNewProject({ ...newProject, impactScore: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Low Impact</span>
                            {renderStars(newProject.impactScore)}
                            <span className="text-sm text-gray-500">High Impact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setIsAddingProject(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddProject}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
                      >
                        Add Project
                      </button>
                    </div>
                  </div>
                )}

                {/* Projects List */}
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map(project => (
                    <div key={project.id} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{project.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              skillDomains.find(d => d.id === project.domain)?.color
                            }`}>
                              {skillDomains.find(d => d.id === project.domain)?.name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(project.completionDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              Impact: {project.impactScore}/5
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem('project', project.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {project.skills.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Skills Used:</p>
                            <div className="flex flex-wrap gap-2">
                              {project.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                              <Github className="h-4 w-4 mr-1" />
                              GitHub
                            </a>
                          )}
                          {project.demoLink && (
                            <a
                              href={project.demoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Achievements & Awards</h2>
                    <p className="text-gray-600">Track your certificates, hackathons, and other accomplishments</p>
                  </div>
                  <button
                    onClick={() => setIsAddingAchievement(true)}
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Achievement
                  </button>
                </div>

                {/* Add Achievement Form */}
                {isAddingAchievement && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-yellow-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Add New Achievement</h3>
                      <button
                        onClick={() => setIsAddingAchievement(false)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Achievement Type
                          </label>
                          <select
                            value={newAchievement.type}
                            onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value as any })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="certificate">Certificate</option>
                            <option value="hackathon">Hackathon</option>
                            <option value="internship">Internship</option>
                            <option value="award">Award</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={newAchievement.title}
                            onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Data Science Professional Certificate"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Issuer
                          </label>
                          <input
                            type="text"
                            value={newAchievement.issuer}
                            onChange={(e) => setNewAchievement({ ...newAchievement, issuer: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Coursera, TechForGood Hackathon"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={newAchievement.date}
                            onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points (For Gamification)
                          </label>
                          <input
                            type="number"
                            value={newAchievement.points}
                            onChange={(e) => setNewAchievement({ ...newAchievement, points: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proof Link
                          </label>
                          <input
                            type="url"
                            value={newAchievement.proofLink}
                            onChange={(e) => setNewAchievement({ ...newAchievement, proofLink: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/proof"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newAchievement.description}
                        onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-black focus:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe your achievement..."
                      />
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setIsAddingAchievement(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAchievement}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
                      >
                        Add Achievement
                      </button>
                    </div>
                  </div>
                )}

                {/* Achievements List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            {achievement.type === 'certificate' && <BadgeCheck className="h-5 w-5 text-blue-500" />}
                            {achievement.type === 'hackathon' && <Trophy className="h-5 w-5 text-yellow-500" />}
                            {achievement.type === 'internship' && <Briefcase className="h-5 w-5 text-green-500" />}
                            {achievement.type === 'award' && <Medal className="h-5 w-5 text-purple-500" />}
                            <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.issuer}</p>
                          <p className="text-sm text-gray-500 mb-4">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteItem('achievement', achievement.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{achievement.points} points</span>
                        </div>
                        {achievement.proofLink && (
                          <a
                            href={achievement.proofLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                          >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            View Proof
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                          <div className="flex items-center">
                            <Settings className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-700">General Settings</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                          <div className="flex items-center">
                            <Bell className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-700">Notifications</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                          <div className="flex items-center">
                            <Share2 className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-700">Privacy Settings</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                          <div className="flex items-center">
                            <Download className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-700">Export Profile Data</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                          <div className="flex items-center">
                            <Trash2 className="h-5 w-5 text-red-400 mr-3" />
                            <span className="text-red-700">Delete Account</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Statistics</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Skills</span>
                          <span className="font-medium text-gray-900">{skills.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Courses Completed</span>
                          <span className="font-medium text-gray-900">{courses.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Projects Done</span>
                          <span className="font-medium text-gray-900">{projects.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Achievements</span>
                          <span className="font-medium text-gray-900">{achievements.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Points</span>
                          <span className="font-medium text-gray-900">
                            {achievements.reduce((acc, a) => acc + a.points, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-colors">
                          <span className="text-gray-700">Share Profile</span>
                        </button>
                        <button className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-colors">
                          <span className="text-gray-700">Generate Resume</span>
                        </button>
                        <button className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-colors">
                          <span className="text-gray-700">View Analytics</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}