"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { completeOnboarding } from "@/lib/onboardingService";
import {
  HeartPulse,
  Sprout,
  Building2,
  ChevronRight,
  Sparkles,
  Target,
  GraduationCap,
  Zap,
  CheckCircle,
  ArrowRight,
  Brain,
  User,
  TrendingUp,
  Shield,
  Star,
  Users,
  Rocket,
  Clock,
  Briefcase,
} from "lucide-react";

// Domain data with images
const domains = [
  {
    id: "healthcare",
    name: "Healthcare Informatics",
    description: "Medical data analysis, patient care optimization, and healthcare technology",
    icon: HeartPulse,
    color: "from-red-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
    image: "/api/placeholder/800/400?text=Healthcare+Informatics",
    roles: [
      { id: "health-1", name: "Clinical Data Analyst", description: "Analyze patient data to improve care outcomes" },
      { id: "health-2", name: "Health Informatics Specialist", description: "Implement and optimize healthcare IT systems" },
    ],
  },
  {
    id: "agritech",
    name: "AgriTech",
    description: "Agricultural technology, precision farming, and sustainable food systems",
    icon: Sprout,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    image: "/api/placeholder/800/400?text=AgriTech",
    roles: [
      { id: "agri-1", name: "Precision Agriculture Specialist", description: "Optimize farming with data and technology" },
      { id: "agri-2", name: "Agricultural Data Scientist", description: "Analyze crop data to improve yields" },
    ],
  },
  {
    id: "smart-city",
    name: "Smart City Systems",
    description: "Urban infrastructure, IoT networks, and sustainable city planning",
    icon: Building2,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    image: "/api/placeholder/800/400?text=Smart+City+Systems",
    roles: [
      { id: "city-1", name: "Urban Data Analyst", description: "Optimize city operations with data insights" },
      { id: "city-2", name: "Smart Infrastructure Engineer", description: "Design and implement connected city systems" },
    ],
  },
];

const skillLevels = [
  {
    id: "beginner",
    name: "Beginner",
    description: "New to the field, seeking foundational knowledge",
    icon: GraduationCap,
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Some experience, looking to advance skills",
    icon: Target,
    color: "from-purple-400 to-pink-400",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);

    const checkAuth = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/auth/login");
        return;
      }

      // Check if already onboarded
      const { data: track } = await supabase
        .from("user_track_selection")
        .select("user_id")
        .eq("user_id", data.user.id)
        .single();

      if (track) router.push("/profile");
    };
    checkAuth();
  }, [router]);

  const currentDomain = domains.find(d => d.id === selectedDomain);
  
  const isStepComplete = () => {
    if (step === 1) return selectedDomain !== null;
    if (step === 2) return selectedRole !== null;
    if (step === 3) return selectedLevel !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 3 && isStepComplete()) {
      setStep(step + 1);
    } else if (step === 3 && isStepComplete()) {
      handleCompleteOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!selectedDomain || !selectedRole || !selectedLevel) return;

    setIsLoading(true);

    try {
      await completeOnboarding({
        domain: selectedDomain,
        role: selectedRole,
        level: selectedLevel,
      });

      router.push("/profile");
      router.refresh();
    } catch (error: any) {
  console.error("Onboarding failed:", error);

  const msg =
    error?.message ||
    error?.error_description ||
    JSON.stringify(error, null, 2);

  setIsLoading(false);
  alert(msg);
}

  };

  const getStarterSkills = () => {
    if (!selectedDomain) return [];
    
    const baseSkills = [
      "Data Analysis Fundamentals",
      "Problem Solving",
      "Communication Skills",
    ];
    
    const domainSkills: Record<string, string[]> = {
      healthcare: ["Medical Terminology", "Healthcare Regulations", "Patient Data Privacy"],
      agritech: ["Agricultural Science Basics", "Sustainability Principles", "Precision Agriculture"],
      "smart-city": ["Urban Planning Basics", "IoT Fundamentals", "Public Infrastructure"],
    };
    
    return [...baseSkills, ...(domainSkills[selectedDomain] || [])];
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Choose Your Career Domain";
      case 2: return "Select Your Target Role";
      case 3: return "Set Your Skill Baseline";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SkillIntelligence</h1>
                <p className="text-sm text-gray-500">Career Onboarding</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Step {step} of 3
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      s === step
                        ? "bg-blue-600 text-white scale-110"
                        : s < step
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-1 mx-2 rounded-full ${
                      s < step ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Step Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Quick Setup • 3 Steps</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {getStepTitle()}
              </h2>
              
              <p className="text-gray-600">
                {step === 1 && "Select the industry domain that aligns with your career aspirations. We'll tailor your learning path accordingly."}
                {step === 2 && "Choose a specific role to focus your skill development. You can always explore other roles later."}
                {step === 3 && "Tell us about your current experience level so we can create the perfect starting point for you."}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            {step === 1 && (
              <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                      selectedDomain === domain.id
                        ? 'border-blue-500 bg-gradient-to-br from-white to-blue-50 shadow-lg scale-[1.02]'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-xl ${domain.bgColor} mb-4`}>
                        <domain.icon className={`h-8 w-8 bg-gradient-to-br ${domain.color} bg-clip-text text-transparent`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {domain.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {domain.description}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Users className="h-3 w-3" />
                        <span>2 roles available</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>12-week program</span>
                      </div>
                    </div>
                    
                    {selectedDomain === domain.id && (
                      <div className="absolute top-4 right-4 animate-pulse">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && currentDomain && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-3 rounded-xl ${currentDomain.bgColor}`}>
                      <currentDomain.icon className={`h-6 w-6 bg-gradient-to-br ${currentDomain.color} bg-clip-text text-transparent`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{currentDomain.name}</h3>
                      <p className="text-sm text-gray-500">Selected domain</p>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">
                    Available Roles in {currentDomain.name}
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentDomain.roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                          selectedRole === role.id
                            ? 'border-blue-500 bg-gradient-to-br from-white to-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Briefcase className="h-4 w-4 text-gray-400" />
                              <h4 className="font-semibold text-gray-900">
                                {role.name}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                              {role.description}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <TrendingUp className="h-3 w-3" />
                              <span>High demand role</span>
                            </div>
                          </div>
                          {selectedRole === role.id && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      currentDomain?.bgColor || 'from-blue-500/10 to-indigo-500/10'
                    }`}>
                      {currentDomain ? (
                        <currentDomain.icon className={`h-6 w-6 bg-gradient-to-br ${
                          currentDomain?.color || 'from-blue-500 to-indigo-600'
                        } bg-clip-text text-transparent`} />
                      ) : (
                        <User className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {currentDomain?.name || "Select Domain"} • {currentDomain?.roles.find(r => r.id === selectedRole)?.name || "Select Role"}
                      </h3>
                      <p className="text-sm text-gray-500">Your selected career path</p>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">
                    What's your current experience level?
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {skillLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 ${
                          selectedLevel === level.id
                            ? 'border-blue-500 bg-gradient-to-br from-white to-blue-50 shadow-lg scale-[1.02]'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${level.color} bg-opacity-10 mb-4`}>
                            <level.icon className={`h-8 w-8 bg-gradient-to-br ${level.color} bg-clip-text text-transparent`} />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {level.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {level.description}
                          </p>
                        </div>
                        
                        {selectedLevel === level.id && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Starter Skills Preview */}
                {selectedLevel && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Zap className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Your Starter Skills</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Based on your selections, we'll pre-fill your profile with these foundational skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getStarterSkills().map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-white border border-green-200 text-green-700 text-sm font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-8 border-t border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={step === 1 || isLoading}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  step === 1 || isLoading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Back
              </button>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete() || isLoading}
                  className={`group relative px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isStepComplete() && !isLoading
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Creating Profile...
                    </div>
                  ) : step === 3 ? (
                    <div className="flex items-center">
                      Complete Onboarding
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Continue
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Personalized Path</h4>
            </div>
            <p className="text-sm text-gray-600">
              Get a learning path tailored to your chosen career track and current skill level.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                <Rocket className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Fast Onboarding</h4>
            </div>
            <p className="text-sm text-gray-600">
              Start learning immediately with pre-configured skills and recommended resources.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Flexible Updates</h4>
            </div>
            <p className="text-sm text-gray-600">
              You can always change your domain, role, or skill level later as you grow.
            </p>
          </div>
        </div>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}