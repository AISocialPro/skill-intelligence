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
  Loader2,
} from "lucide-react";

// Types
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

export default function RecommendationsPage() {
  const router = useRouter();
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [aiStats, setAiStats] = useState<any>({});
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'projects' | 'roadmap'>('courses');

  // Fetch all recommendations data
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/recommendations');
      const result = await response.json();

      if (result.success) {
        const { data } = result;
        setSkillGaps(data.skillGaps || []);
        setCourses(data.courses || []);
        setProjects(data.projects || []);
        setRoadmap(data.roadmap || []);
        setSavedItems(data.savedItems || []);
        setAiInsight(data.aiInsight?.insight || '');
        setAiStats(data.aiInsight?.stats || {});
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkStarted = async (type: 'course' | 'project', id: string) => {
    try {
      const action = type === 'course' ? 'update-course' : 'update-project';
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          itemId: id,
          status: 'started',
          progress: 10
        })
      });

      const result = await response.json();
      if (result.success) {
        if (type === 'course') {
          setCourses(courses.map(course => 
            course.id === id ? { ...course, status: 'started', progress: 10 } : course
          ));
        } else {
          setProjects(projects.map(project => 
            project.id === id ? { ...project, status: 'started', progress: 10 } : project
          ));
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleMarkCompleted = async (type: 'course' | 'project', id: string) => {
    try {
      const action = type === 'course' ? 'update-course' : 'update-project';
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          itemId: id,
          status: 'completed',
          progress: 100
        })
      });

      const result = await response.json();
      if (result.success) {
        if (type === 'course') {
          setCourses(courses.map(course => 
            course.id === id ? { ...course, status: 'completed', progress: 100 } : course
          ));
        } else {
          setProjects(projects.map(project => 
            project.id === id ? { ...project, status: 'completed', progress: 100 } : project
          ));
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleToggleSave = async (id: string, type: 'course' | 'project') => {
    try {
      const isSaved = savedItems.includes(id);
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isSaved ? 'unsave' : 'save',
          itemId: id,
          type
        })
      });

      const result = await response.json();
      if (result.success) {
        setSavedItems(prev => 
          isSaved ? prev.filter(item => item !== id) : [...prev, id]
        );
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleGenerateNewRoadmap = async () => {
    try {
      setIsGeneratingRoadmap(true);
      const response = await fetch('/api/recommendations', {
        method: 'PUT'
      });

      const result = await response.json();
      if (result.success) {
        setRoadmap(result.data.roadmap);
        setAiInsight(result.data.aiInsight.insight);
        setAiStats(result.data.aiInsight.stats);
      }
    } catch (error) {
      console.error('Error regenerating roadmap:', error);
    } finally {
      setIsGeneratingRoadmap(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your personalized recommendations...</p>
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
                AI-powered course and project recommendations based on your skill gaps
              </p>
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
        {showAIInsights && aiInsight && (
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
                        {aiStats.highPriorityGaps || 0} high-priority gaps identified
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Time Investment</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {aiStats.totalEstimatedHours || 0} hours over 30 days
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Expected Outcome</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Close {aiStats.totalGaps || 0} skill levels
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
                  <h3 className="text-lg font-semibold text-gray-900">Your Top {skillGaps.length} Skill Gaps</h3>
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
                    {filteredCourses.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No courses found matching your criteria</p>
                      </div>
                    ) : (
                      filteredCourses.map(course => (
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
                                    onClick={() => handleToggleSave(course.id, 'course')}
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