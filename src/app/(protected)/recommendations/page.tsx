"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  Briefcase,
  Calendar,
  Target,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Filter,
  Search,
  Bookmark,
  BookmarkCheck,
  PlayCircle,
  Award,
  Users,
  Rocket,
  Brain,
  ChevronRight,
  Download,
  Share2,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Eye,
  EyeOff,
  Heart,
  X,
  Github,
} from "lucide-react";

// Recommendation data structures
interface SkillGap {
  id: string;
  name: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  importance: 'high' | 'medium' | 'low';
  domain: string;
}

interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  skills: string[];
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: 'free' | 'paid';
  rating: number;
  reviewCount: number;
  link: string;
  completionTime: string;
  whyRecommended: string;
  status: 'not-started' | 'started' | 'completed';
  progress?: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  resources: string[];
  githubTemplate?: string;
  demoLink?: string;
  whyRecommended: string;
  status: 'not-started' | 'started' | 'completed';
  progress?: number;
}

interface RoadmapWeek {
  week: number;
  focus: string;
  courses: string[];
  projects: string[];
  goals: string[];
  estimatedHours: number;
}

// Sample data (in production, this would come from API)
const sampleSkillGaps: SkillGap[] = [
  {
    id: "1",
    name: "Healthcare Regulations",
    currentLevel: 1,
    requiredLevel: 4,
    gap: 3,
    importance: 'high',
    domain: 'healthcare'
  },
  {
    id: "2",
    name: "Advanced SQL",
    currentLevel: 2,
    requiredLevel: 4,
    gap: 2,
    importance: 'high',
    domain: 'tech'
  },
  {
    id: "3",
    name: "Medical Terminology",
    currentLevel: 0,
    requiredLevel: 3,
    gap: 3,
    importance: 'medium',
    domain: 'healthcare'
  },
  {
    id: "4",
    name: "Data Visualization",
    currentLevel: 3,
    requiredLevel: 4,
    gap: 1,
    importance: 'medium',
    domain: 'tech'
  },
  {
    id: "5",
    name: "Statistics",
    currentLevel: 2,
    requiredLevel: 4,
    gap: 2,
    importance: 'medium',
    domain: 'tech'
  }
];

const coursesCatalog: Course[] = [
  {
    id: "c1",
    title: "Healthcare Data Analysis & Visualization",
    provider: "Coursera - Johns Hopkins University",
    description: "Learn to analyze and visualize healthcare data using Python and Tableau. Covers HIPAA compliance and medical data privacy.",
    skills: ["Healthcare Regulations", "Data Visualization", "Python", "Tableau"],
    duration: "6 weeks",
    level: "intermediate",
    price: "free",
    rating: 4.8,
    reviewCount: 1243,
    link: "https://coursera.org/learn/healthcare-data",
    completionTime: "30-40 hours",
    whyRecommended: "Directly addresses your healthcare regulations gap and improves data visualization skills.",
    status: "not-started"
  },
  {
    id: "c2",
    title: "Advanced SQL for Healthcare Analytics",
    provider: "Udemy",
    description: "Master complex SQL queries for healthcare data analysis, including patient records and treatment outcomes.",
    skills: ["Advanced SQL", "Healthcare Analytics", "Data Analysis"],
    duration: "8 weeks",
    level: "intermediate",
    price: "paid",
    rating: 4.7,
    reviewCount: 892,
    link: "https://udemy.com/advanced-sql-healthcare",
    completionTime: "40-50 hours",
    whyRecommended: "Targets your SQL gap specifically for healthcare applications.",
    status: "not-started"
  },
  {
    id: "c3",
    title: "Medical Terminology for Data Professionals",
    provider: "edX - Harvard Medical School",
    description: "Essential medical terminology for working with healthcare data and communicating with medical professionals.",
    skills: ["Medical Terminology", "Healthcare Communication"],
    duration: "4 weeks",
    level: "beginner",
    price: "free",
    rating: 4.6,
    reviewCount: 567,
    link: "https://edx.org/learn/medical-terminology",
    completionTime: "20-25 hours",
    whyRecommended: "Fills your medical terminology gap, essential for healthcare data roles.",
    status: "not-started"
  },
  {
    id: "c4",
    title: "Statistics for Healthcare Data Science",
    provider: "DataCamp",
    description: "Statistical methods specifically tailored for healthcare data analysis and clinical research.",
    skills: ["Statistics", "Healthcare Analytics", "Data Science"],
    duration: "5 weeks",
    level: "intermediate",
    price: "paid",
    rating: 4.5,
    reviewCount: 432,
    link: "https://datacamp.com/courses/healthcare-stats",
    completionTime: "25-30 hours",
    whyRecommended: "Addresses your statistics gap in the context of healthcare applications.",
    status: "not-started"
  },
  {
    id: "c5",
    title: "Tableau for Healthcare Dashboards",
    provider: "LinkedIn Learning",
    description: "Create interactive healthcare dashboards in Tableau with focus on patient outcomes and hospital metrics.",
    skills: ["Data Visualization", "Tableau", "Healthcare Analytics"],
    duration: "3 weeks",
    level: "intermediate",
    price: "paid",
    rating: 4.4,
    reviewCount: 321,
    link: "https://linkedin.com/learning/tableau-healthcare",
    completionTime: "15-20 hours",
    whyRecommended: "Improves your data visualization skills for healthcare applications.",
    status: "not-started"
  }
];

const projectsCatalog: Project[] = [
  {
    id: "p1",
    title: "Healthcare Analytics Dashboard",
    description: "Build an interactive dashboard visualizing patient outcomes, hospital performance metrics, and treatment effectiveness.",
    skills: ["Data Visualization", "Python", "Healthcare Analytics", "SQL"],
    difficulty: "intermediate",
    estimatedTime: "40-50 hours",
    resources: ["Sample healthcare dataset", "Dashboard templates", "HIPAA compliance guide"],
    githubTemplate: "https://github.com/templates/healthcare-dashboard",
    demoLink: "https://demo.healthcare-analytics.com",
    whyRecommended: "Combines multiple gap skills - healthcare regulations, SQL, and data visualization.",
    status: "not-started"
  },
  {
    id: "p2",
    title: "Medical Terminology Learning App",
    description: "Create a web application that helps users learn and test medical terminology with flashcards and quizzes.",
    skills: ["Medical Terminology", "Web Development", "UI/UX Design"],
    difficulty: "beginner",
    estimatedTime: "20-30 hours",
    resources: ["Medical terms database", "UI design templates", "Quiz framework"],
    githubTemplate: "https://github.com/templates/medical-terms-app",
    whyRecommended: "Directly addresses your medical terminology gap through practical application.",
    status: "not-started"
  },
  {
    id: "p3",
    title: "Patient Data Analysis Pipeline",
    description: "Design and implement a data pipeline for analyzing patient records while ensuring HIPAA compliance.",
    skills: ["Healthcare Regulations", "SQL", "Data Pipelines", "Python"],
    difficulty: "advanced",
    estimatedTime: "50-60 hours",
    resources: ["HIPAA compliance checklist", "Sample patient data", "Pipeline architecture guide"],
    githubTemplate: "https://github.com/templates/patient-data-pipeline",
    whyRecommended: "Targets your high-priority gaps in healthcare regulations and SQL.",
    status: "not-started"
  },
  {
    id: "p4",
    title: "Statistical Analysis of Clinical Trials",
    description: "Analyze clinical trial data using statistical methods to determine treatment effectiveness and side effects.",
    skills: ["Statistics", "Data Analysis", "Healthcare Analytics", "Python"],
    difficulty: "intermediate",
    estimatedTime: "30-40 hours",
    resources: ["Clinical trial datasets", "Statistical analysis libraries", "Research paper template"],
    githubTemplate: "https://github.com/templates/clinical-trials-analysis",
    whyRecommended: "Improves your statistics skills in a real-world healthcare context.",
    status: "not-started"
  }
];

const roadmapWeeks: RoadmapWeek[] = [
  {
    week: 1,
    focus: "Healthcare Foundations",
    courses: ["Medical Terminology for Data Professionals"],
    projects: ["Medical Terminology Learning App"],
    goals: [
      "Understand basic medical terminology",
      "Complete terminology course",
      "Start medical terms app project"
    ],
    estimatedHours: 15
  },
  {
    week: 2,
    focus: "Data Visualization Skills",
    courses: ["Tableau for Healthcare Dashboards"],
    projects: ["Healthcare Analytics Dashboard (Part 1)"],
    goals: [
      "Master Tableau for healthcare dashboards",
      "Design dashboard layout",
      "Complete Tableau course"
    ],
    estimatedHours: 20
  },
  {
    week: 3,
    focus: "Advanced SQL & Statistics",
    courses: ["Advanced SQL for Healthcare Analytics", "Statistics for Healthcare Data Science"],
    projects: ["Healthcare Analytics Dashboard (Part 2)"],
    goals: [
      "Learn advanced SQL queries",
      "Understand healthcare statistics",
      "Implement database layer"
    ],
    estimatedHours: 25
  },
  {
    week: 4,
    focus: "Healthcare Regulations & Integration",
    courses: ["Healthcare Data Analysis & Visualization"],
    projects: ["Patient Data Analysis Pipeline"],
    goals: [
      "Master healthcare regulations",
      "Complete final projects",
      "Review all learned skills"
    ],
    estimatedHours: 30
  }
];

export default function RecommendationsPage() {
  const router = useRouter();
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>(sampleSkillGaps);
  const [courses, setCourses] = useState<Course[]>(coursesCatalog);
  const [projects, setProjects] = useState<Project[]>(projectsCatalog);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>(roadmapWeeks);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'projects' | 'roadmap'>('courses');

  // Generate AI insight on component mount
  useEffect(() => {
    generateAIInsight();
    // Load saved items from localStorage
    const saved = localStorage.getItem('recommendations_saved');
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  // Save items to localStorage when savedItems changes
  useEffect(() => {
    localStorage.setItem('recommendations_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  const generateAIInsight = () => {
    const totalGap = skillGaps.reduce((sum, gap) => sum + gap.gap, 0);
    const highPriorityGaps = skillGaps.filter(g => g.importance === 'high').length;
    
    const insights = [
      `Based on your skill gaps, I recommend focusing on ${highPriorityGaps} high-priority skills first. Your roadmap is designed to close ${totalGap} skill levels in 30 days.`,
      `Your biggest opportunity is in healthcare domain skills. The recommended path balances technical skills with domain knowledge for maximum career impact.`,
      `Starting with foundational courses while working on practical projects will accelerate your learning. Each week builds upon the previous one's knowledge.`,
      `The 30-day roadmap is optimized for efficient skill development. Projects are sequenced to reinforce course learning through hands-on application.`
    ];
    
    setAiInsight(insights[Math.floor(Math.random() * insights.length)]);
  };

  const handleMarkStarted = (type: 'course' | 'project', id: string) => {
    if (type === 'course') {
      setCourses(courses.map(course => 
        course.id === id ? { ...course, status: 'started', progress: 10 } : course
      ));
    } else {
      setProjects(projects.map(project => 
        project.id === id ? { ...project, status: 'started', progress: 10 } : project
      ));
    }
  };

  const handleMarkCompleted = (type: 'course' | 'project', id: string) => {
    if (type === 'course') {
      setCourses(courses.map(course => 
        course.id === id ? { ...course, status: 'completed', progress: 100 } : course
      ));
    } else {
      setProjects(projects.map(project => 
        project.id === id ? { ...project, status: 'completed', progress: 100 } : project
      ));
    }
  };

  const handleToggleSave = (id: string) => {
    setSavedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleGenerateNewRoadmap = () => {
    setIsGeneratingRoadmap(true);
    // Simulate AI generating new roadmap
    setTimeout(() => {
      const newRoadmap = [...roadmapWeeks].map(week => ({
        ...week,
        estimatedHours: week.estimatedHours + Math.floor(Math.random() * 5)
      }));
      setRoadmap(newRoadmap);
      setIsGeneratingRoadmap(false);
      generateAIInsight();
    }, 1500);
  };

  const filteredCourses = courses.filter(course => {
    if (filter !== 'all' && course.level !== filter) return false;
    if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !course.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredProjects = projects.filter(project => {
    if (filter !== 'all' && project.difficulty !== filter) return false;
    if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'started': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch(importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <ChevronRight className="h-5 w-5 rotate-180 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Skill Quest</h1>
                  <p className="text-sm text-gray-500">Personalized Recommendations</p>
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Personalized Recommendations</h2>
              <p className="text-gray-600 mt-2">
                Objective #3: AI-powered course and project recommendations based on your skill gaps
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-full">
                  Hackathon_Ingenium_PS
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-full">
                  Rule-based + AI Assist
                </div>
              </div>
            </div>
            <button
              onClick={handleGenerateNewRoadmap}
              disabled={isGeneratingRoadmap}
              className="mt-4 md:mt-0 flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {isGeneratingRoadmap ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Regenerate Roadmap
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Insight */}
        {showAIInsights && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insight</h3>
                  <p className="text-gray-700">{aiInsight}</p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Priority Skills</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {skillGaps.filter(g => g.importance === 'high').length} high-priority gaps identified
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Time Investment</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {roadmap.reduce((sum, week) => sum + week.estimatedHours, 0)} hours over 30 days
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Expected Outcome</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Close {skillGaps.reduce((sum, gap) => sum + gap.gap, 0)} skill levels
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAIInsights(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Skill Gaps & Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Gaps */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Top 5 Skill Gaps</h3>
                  <p className="text-sm text-gray-500">Based on your latest assessment results</p>
                </div>
                <Target className="h-5 w-5 text-blue-600" />
              </div>

              <div className="space-y-4">
                {skillGaps.map((gap, index) => (
                  <div key={gap.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{gap.name}</h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImportanceColor(gap.importance)}`}>
                              {gap.importance.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">{gap.domain}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-red-600">-{gap.gap}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Skill Level</span>
                          <span>Gap: {gap.currentLevel} → {gap.requiredLevel}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-blue-500"
                              style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                            />
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < gap.currentLevel
                                    ? "text-yellow-500 fill-yellow-500"
                                    : i < gap.requiredLevel
                                    ? "text-blue-300"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                          <BookOpen className="h-4 w-4 mr-1" />
                          View Courses
                        </button>
                        <button className="flex items-center text-sm text-green-600 hover:text-green-700">
                          <Briefcase className="h-4 w-4 mr-1" />
                          View Projects
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: 'courses', label: 'Recommended Courses', icon: BookOpen, count: filteredCourses.length },
                    { id: 'projects', label: 'Recommended Projects', icon: Briefcase, count: filteredProjects.length },
                    { id: 'roadmap', label: '30-Day Roadmap', icon: Calendar, count: roadmap.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-2" />
                      {tab.label}
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
  type="text"
  placeholder="Search recommendations..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-black placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-5 w-5 text-gray-400" />
                      <select
  value={filter}
  onChange={(e) => setFilter(e.target.value as any)}
  className="border border-gray-300 rounded-xl px-3 py-2 text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                  <div className="space-y-6">
                    {filteredCourses.map(course => (
                      <div key={course.id} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                                <div className="flex items-center flex-wrap gap-2 mb-3">
                                  <span className="text-sm text-gray-600">{course.provider}</span>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
                                    {course.level}
                                  </span>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    course.price === 'free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {course.price === 'free' ? 'Free' : 'Paid'}
                                  </span>
                                  <span className="flex items-center text-sm text-yellow-600">
                                    <Star className="h-4 w-4 fill-current mr-1" />
                                    {course.rating} ({course.reviewCount})
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleToggleSave(course.id)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                  {savedItems.includes(course.id) ? (
                                    <BookmarkCheck className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <Bookmark className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => course.status === 'not-started' ? handleMarkStarted('course', course.id) : undefined}
                                  className={`p-2 rounded-lg ${
                                    course.status === 'not-started'
                                      ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                      : 'text-blue-600 bg-blue-50'
                                  }`}
                                >
                                  {course.status === 'not-started' ? (
                                    <PlayCircle className="h-5 w-5" />
                                  ) : course.status === 'started' ? (
                                    <Clock className="h-5 w-5" />
                                  ) : (
                                    <CheckCircle className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-4">{course.description}</p>
                            
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-700 mb-2">
                                  <Lightbulb className="h-4 w-4 inline mr-1 text-blue-600" />
                                  <span className="font-medium">Why this course:</span> {course.whyRecommended}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                  {course.skills.map(skill => (
                                    <span
                                      key={skill}
                                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {course.duration} • {course.completionTime}
                                </div>
                              </div>
                              
                              {course.status !== 'not-started' && (
                                <div>
                                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                      style={{ width: `${course.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <a
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View Course
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                          {course.status === 'started' && (
                            <button
                              onClick={() => handleMarkCompleted('course', course.id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-600"
                            >
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    {filteredProjects.map(project => (
                      <div key={project.id} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                                <div className="flex items-center flex-wrap gap-2 mb-3">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(project.difficulty)}`}>
                                    {project.difficulty}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-600">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {project.estimatedTime}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleToggleSave(project.id)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                  {savedItems.includes(project.id) ? (
                                    <BookmarkCheck className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <Bookmark className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => project.status === 'not-started' ? handleMarkStarted('project', project.id) : undefined}
                                  className={`p-2 rounded-lg ${
                                    project.status === 'not-started'
                                      ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                      : 'text-blue-600 bg-blue-50'
                                  }`}
                                >
                                  {project.status === 'not-started' ? (
                                    <PlayCircle className="h-5 w-5" />
                                  ) : project.status === 'started' ? (
                                    <Clock className="h-5 w-5" />
                                  ) : (
                                    <CheckCircle className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-4">{project.description}</p>
                            
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-700 mb-2">
                                  <Lightbulb className="h-4 w-4 inline mr-1 text-blue-600" />
                                  <span className="font-medium">Why this project:</span> {project.whyRecommended}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-700 mb-2">Skills Developed:</p>
                                <div className="flex flex-wrap gap-2">
                                  {project.skills.map(skill => (
                                    <span
                                      key={skill}
                                      className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-700 mb-2">Resources:</p>
                                <ul className="space-y-1">
                                  {project.resources.map((resource, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                                      <ChevronRight className="h-3 w-3 mr-2 text-gray-400" />
                                      {resource}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {project.status !== 'not-started' && (
                                <div>
                                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                      style={{ width: `${project.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-4">
                            {project.githubTemplate && (
                              <a
                                href={project.githubTemplate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 hover:text-gray-900"
                              >
                                <Github className="h-5 w-5 mr-1" />
                                Template
                              </a>
                            )}
                            {project.demoLink && (
                              <a
                                href={project.demoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 hover:text-gray-900"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Live Demo
                              </a>
                            )}
                          </div>
                          {project.status === 'started' && (
                            <button
                              onClick={() => handleMarkCompleted('project', project.id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-600"
                            >
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Roadmap Tab */}
                {activeTab === 'roadmap' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Rocket className="h-6 w-6 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Your 30-Day Learning Roadmap</h4>
                          <p className="text-sm text-gray-600">Weekly plan designed to close your skill gaps efficiently</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                          <p className="text-2xl font-bold text-gray-900">
                            {roadmap.reduce((sum, week) => sum + week.estimatedHours, 0)}
                          </p>
                          <p className="text-xs text-gray-600">Total Hours</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                          <p className="text-2xl font-bold text-gray-900">
                            {courses.filter(c => c.status === 'completed').length}/{courses.length}
                          </p>
                          <p className="text-xs text-gray-600">Courses</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                          <p className="text-2xl font-bold text-gray-900">
                            {projects.filter(p => p.status === 'completed').length}/{projects.length}
                          </p>
                          <p className="text-xs text-gray-600">Projects</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                          <p className="text-2xl font-bold text-gray-900">
                            {Math.round((courses.filter(c => c.status === 'completed').length + projects.filter(p => p.status === 'completed').length) / 
                             (courses.length + projects.length) * 100)}%
                          </p>
                          <p className="text-xs text-gray-600">Completion</p>
                        </div>
                      </div>
                    </div>

                    {roadmap.map(week => (
                      <div key={week.week} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                                W{week.week}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Week {week.week}: {week.focus}</h4>
                                <p className="text-sm text-gray-600">{week.estimatedHours} estimated hours</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                              {week.estimatedHours}h/week
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                                Courses to Complete
                              </h5>
                              <ul className="space-y-2">
                                {week.courses.map((course, idx) => {
                                  const courseData = courses.find(c => c.title.includes(course));
                                  return (
                                    <li key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                      <span className="text-sm text-gray-700">{course}</span>
                                      {courseData && (
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(courseData.status)}`}>
                                          {courseData.status}
                                        </span>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                                Projects to Work On
                              </h5>
                              <ul className="space-y-2">
                                {week.projects.map((project, idx) => {
                                  const projectData = projects.find(p => p.title.includes(project));
                                  return (
                                    <li key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                      <span className="text-sm text-gray-700">{project}</span>
                                      {projectData && (
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(projectData.status)}`}>
                                          {projectData.status}
                                        </span>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <Target className="h-5 w-5 text-purple-600 mr-2" />
                              Weekly Goals
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {week.goals.map((goal, idx) => (
                                <div key={idx} className="p-3 bg-purple-50 rounded-lg">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                    <span className="text-sm text-gray-700">{goal}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Courses Progress</span>
                    <span className="text-sm font-medium text-blue-600">
                      {courses.filter(c => c.status === 'completed').length}/{courses.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${(courses.filter(c => c.status === 'completed').length / courses.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Projects Progress</span>
                    <span className="text-sm font-medium text-green-600">
                      {projects.filter(p => p.status === 'completed').length}/{projects.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${(projects.filter(p => p.status === 'completed').length / projects.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Skill Gap Reduction</span>
                    <span className="text-sm font-medium text-purple-600">
                      {Math.round((skillGaps.filter(g => g.currentLevel >= g.requiredLevel).length / skillGaps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
                      style={{ width: `${(skillGaps.filter(g => g.currentLevel >= g.requiredLevel).length / skillGaps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Daily Recommendation</p>
                    <p className="text-sm text-gray-600">
                      Complete 1 course module and work on a project for 2 hours today
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Items</h3>
              
              <div className="space-y-3">
                {savedItems.length > 0 ? (
                  savedItems.slice(0, 3).map(itemId => {
                    const course = courses.find(c => c.id === itemId);
                    const project = projects.find(p => p.id === itemId);
                    const item = course || project;
                    
                    return item ? (
                      <div key={itemId} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {course ? 'Course' : 'Project'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleSave(itemId)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <BookmarkCheck className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })
                ) : (
                  <div className="text-center py-4">
                    <Bookmark className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No saved items yet</p>
                  </div>
                )}
                
                {savedItems.length > 0 && (
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 pt-2">
                    View all {savedItems.length} saved items
                  </button>
                )}
              </div>
            </div>

            {/* Recommendation Engine */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Recommendations Work</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Rule-Based Matching</h4>
                    <p className="text-sm text-gray-600">Skills in courses/projects matched to your gaps</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Difficulty Progression</h4>
                    <p className="text-sm text-gray-600">Starts with basics, progresses to advanced</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">AI Optimization</h4>
                    <p className="text-sm text-gray-600">Personalized based on your learning pace</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3" />
                    <span>Add to Calendar</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center">
                    <Download className="h-5 w-5 mr-3" />
                    <span>Export Roadmap</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    <span>Find Study Group</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}