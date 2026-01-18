"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Zap,
  CheckCircle,
  Clock,
  Star,
  Rocket,
  Brain,
  Code,
  BarChart3,
  Users,
  RefreshCw,
  Download,
  Share2,
  Filter,
  MoreVertical,
  ArrowUpRight,
  TargetIcon,
  TrendingUpIcon,
  AwardIcon,
  BookIcon,
  CalendarIcon,
  ChevronRightIcon,
  Settings as SettingsIcon,
  Sparkles,
  Youtube,
} from "lucide-react";

// Mock data for the dashboard
const mockData = {
  user: {
    name: "Alex Johnson",
    role: "Frontend Developer",
    level: "Intermediate",
    joinDate: "2024-01-15",
  },
  readinessScore: 78,
  skillProgression: [
    { month: "Jan", score: 45 },
    { month: "Feb", score: 58 },
    { month: "Mar", score: 65 },
    { month: "Apr", score: 72 },
    { month: "May", score: 78 },
  ],
  completed: {
    courses: 12,
    projects: 8,
    assessments: 5,
  },
  careerPathway: [
    { id: 1, title: "Beginner Fundamentals", status: "completed", progress: 100 },
    { id: 2, title: "Core Concepts", status: "completed", progress: 100 },
    { id: 3, title: "Intermediate Projects", status: "in-progress", progress: 75 },
    { id: 4, title: "Advanced Topics", status: "upcoming", progress: 0 },
    { id: 5, title: "Job Ready", status: "upcoming", progress: 0 },
  ],
  nextActions: [
    { id: 1, title: "Complete React Hooks Course", due: "Today", priority: "high" },
    { id: 2, title: "Submit Portfolio Project", due: "Tomorrow", priority: "medium" },
    { id: 3, title: "Practice Algorithm Challenges", due: "In 3 days", priority: "medium" },
    { id: 4, title: "Attend Webinar: Advanced State Management", due: "This week", priority: "low" },
  ],
  badges: [
    { id: 1, name: "Quick Learner", icon: "🚀", earned: "2024-03-15", description: "Complete 5 courses in one month" },
    { id: 2, name: "Project Master", icon: "🏆", earned: "2024-04-10", description: "Successfully complete 3 projects" },
    { id: 3, name: "Consistency King", icon: "👑", earned: "2024-05-01", description: "30-day learning streak" },
    { id: 4, name: "Assessment Pro", icon: "📊", earned: "2024-05-20", description: "Score above 80% on all assessments" },
  ],
  progressTrend: {
    weeklyChange: "+12%",
    monthlyChange: "+28%",
    overallGrowth: "+73%",
  },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("monthly");
  const router = useRouter();

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  }, [timeframe]);

  const handleReRunAssessment = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert("Assessment re-run initiated! Results will be available shortly.");
      setIsLoading(false);
    }, 1500);
  };

  const handleDownloadReport = () => {
    // Simulate report download
    alert("Progress report downloaded successfully!");
  };

  const calculateScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const calculateScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Skill Quest</h1>
                  <p className="text-sm text-gray-500">AI-Powered Skill Assessment</p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-gray-900 font-medium" style={{ color: '#4361ee' }}>Objective</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => router.push('/assessment')}
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  View Assessment
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Update Career Path
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={() => router.push('/profile')}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all"
                >
                  AJ
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Career Pathway Dashboard</h2>
              <p className="text-gray-600 mt-2">
                Track your progression towards becoming job-ready with AI-powered insights
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium" style={{ color: '#4361ee' }}>Objective</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="relative" style={{ color: '#4361ee' }}>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="weekly">Weekly View</option>
                  <option value="monthly">Monthly View</option>
                  <option value="quarterly">Quarterly View</option>
                </select>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => router.push('/resources')}
                className="py-2 px-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
              >
                Resources
              </button>
              <button
                onClick={() => router.push('/pathways')}
                className="py-2 px-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
              >
                Pathway
              </button>
              <button
                onClick={() => router.push('/assessment')}
                className="py-2 px-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
              >
                Assessment
              </button>
            </nav>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Readiness Score Gauge */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Readiness Score</h3>
                  <p className="text-sm text-gray-500">Your overall job-readiness assessment</p>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+12% this month</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="relative w-64 h-64 mb-6 md:mb-0">
                  {/* Circular Progress */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${mockData.readinessScore * 2.83} 283`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-bold ${calculateScoreColor(mockData.readinessScore)}`}>
                      {mockData.readinessScore}
                    </span>
                    <span className="text-gray-500">out of 100</span>
                    <div className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                      {mockData.readinessScore >= 80 ? "Excellent" : mockData.readinessScore >= 60 ? "Good" : "Needs Improvement"}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Courses Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{mockData.completed.courses}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Code className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Projects Done</p>
                      <p className="text-2xl font-bold text-gray-900">{mockData.completed.projects}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assessments Taken</p>
                      <p className="text-2xl font-bold text-gray-900">{mockData.completed.assessments}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Progression Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Skill Progression</h3>
                  <p className="text-sm text-gray-500">Your growth over the last 5 months</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Overall Growth:</span>
                  <span className="text-sm font-medium text-green-600">{mockData.progressTrend.overallGrowth}</span>
                </div>
              </div>

              <div className="h-64">
                <div className="flex items-end h-48 space-x-4 mt-4">
                  {mockData.skillProgression.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-2">{item.month}</div>
                      <div className="relative w-full flex justify-center">
                        <div
                          className={`w-12 rounded-t-lg ${calculateScoreBgColor(item.score)} transition-all duration-300 hover:opacity-80`}
                          style={{ height: `${item.score * 1.5}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                            Score: {item.score}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium mt-2">{item.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500">Weekly Change</p>
                    <p className="text-xl font-bold text-green-600">{mockData.progressTrend.weeklyChange}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-500">Monthly Change</p>
                    <p className="text-xl font-bold text-green-600">{mockData.progressTrend.monthlyChange}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-500">Next Goal</p>
                    <p className="text-xl font-bold text-blue-600">85</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Pathway Steps */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Career Pathway</h3>
                  <p className="text-sm text-gray-500">Your journey from Beginner to Job-ready</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Step 3 of 5</span>
                </div>
              </div>

              <div className="space-y-4">
                {mockData.careerPathway.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      step.status === "completed"
                        ? "bg-green-50 border-green-200"
                        : step.status === "in-progress"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : step.status === "in-progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {step.status === "completed" ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : step.status === "in-progress" ? (
                            <Clock className="h-6 w-6" />
                          ) : (
                            <Star className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{step.title}</h4>
                          <p className="text-sm text-gray-500">
                            {step.status === "completed"
                              ? "Completed"
                              : step.status === "in-progress"
                              ? "In Progress"
                              : "Upcoming"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              step.status === "completed"
                                ? "bg-green-500"
                                : step.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{step.progress}%</span>
                        {step.status === "in-progress" && (
                          <button className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                            Continue
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/pathways')}
                className="w-full mt-6 py-3 text-center text-blue-600 font-medium border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Explore Full Pathway
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Next Actions - 7-Day Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Next Actions</h3>
                  <p className="text-sm text-gray-500">Your 7-day learning plan</p>
                </div>
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>

              <div className="space-y-4">
                {mockData.nextActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            action.priority === "high" 
                              ? "bg-red-500" 
                              : action.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`} />
                          <span className="text-xs font-medium text-gray-500 uppercase">{action.priority} priority</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          Due: {action.due}
                        </div>
                      </div>
                      <button className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/recommendations')}
                className="w-full mt-6 py-3 text-center text-blue-600 font-medium border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
              >
                View Full Learning Plan
              </button>
            </div>

            {/* Badges & Achievements */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Badges & Achievements</h3>
                  <p className="text-sm text-gray-500">Your earned accomplishments</p>
                </div>
                <Award className="h-5 w-5 text-yellow-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {mockData.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 border border-gray-200 rounded-xl text-center hover:border-yellow-300 transition-colors"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                    <div className="text-xs text-gray-400">Earned {badge.earned}</div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 text-center text-blue-600 font-medium border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                View All Badges
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/assessment')}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 mr-3" />
                    <span>View Assessment</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => router.push('/pathways')}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <Rocket className="h-5 w-5 mr-3" />
                    <span>Explore Pathways</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => router.push('/recommendations')}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-3" />
                    <span>View Recommendations</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => router.push('/resources')}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <Youtube className="h-5 w-5 mr-3" />
                    <span>Find Resources</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <SettingsIcon className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <Target className="h-5 w-5 mr-3" />
                    <span>Update Career Path</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Progress Insights */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Insights</h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-700">You're ahead of schedule!</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Your learning pace is 15% faster than average.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-700">Next milestone in 2 weeks</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">Complete React course to unlock Advanced Projects.</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-700">Skill gap identified</span>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1">Focus on State Management for better scores.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-500">
            <div>
              <span className="font-medium">Last assessment:</span> May 20, 2024 • 
              <span className="ml-2 font-medium">Next review:</span> June 3, 2024
            </div>
            <div className="mt-2 md:mt-0">
              <span className="font-medium">Data updated:</span> Just now
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}