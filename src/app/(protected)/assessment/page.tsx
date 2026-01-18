"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Download,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Award,
  Clock,
  Star,
  Sparkles,
  ArrowRight,
  FileText,
  Users,
  Calendar,
  Shield,
  Lightbulb,
  DownloadCloud,
  Printer,
  Share2,
  Search,
  Filter,
  BookOpen,
  Briefcase,
  Rocket,
  Eye,
  EyeOff,
} from "lucide-react";

// Assessment data structure
interface SkillGap {
  name: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  importance: 'high' | 'medium' | 'low';
  evidence: string[];
}

interface AssessmentResult {
  readinessScore: number;
  skillRadar: SkillGap[];
  missingSkills: string[];
  weakSkills: string[];
  suggestedActions: string[];
  explanation: string;
  timestamp: string;
}

// Sample target tracks
const targetTracks = [
  {
    id: "health-analyst",
    name: "Clinical Data Analyst",
    domain: "Healthcare Informatics",
    description: "Analyze patient data to improve care outcomes",
    requiredSkills: [
      { name: "Data Analysis", level: 4, weight: 0.15 },
      { name: "Medical Terminology", level: 3, weight: 0.10 },
      { name: "Healthcare Regulations", level: 4, weight: 0.12 },
      { name: "Python", level: 4, weight: 0.13 },
      { name: "SQL", level: 4, weight: 0.12 },
      { name: "Data Visualization", level: 3, weight: 0.08 },
      { name: "Statistics", level: 4, weight: 0.10 },
      { name: "Patient Data Privacy", level: 4, weight: 0.10 },
      { name: "Communication Skills", level: 4, weight: 0.10 },
    ]
  },
  {
    id: "agri-specialist",
    name: "Precision Agriculture Specialist",
    domain: "AgriTech",
    description: "Optimize farming with data and technology",
    requiredSkills: [
      { name: "Data Analysis", level: 4, weight: 0.14 },
      { name: "Agricultural Science", level: 3, weight: 0.12 },
      { name: "IoT Systems", level: 4, weight: 0.13 },
      { name: "Python", level: 3, weight: 0.11 },
      { name: "Geospatial Analysis", level: 4, weight: 0.12 },
      { name: "Sustainability Principles", level: 3, weight: 0.09 },
      { name: "Farm Management", level: 3, weight: 0.10 },
      { name: "Sensor Networks", level: 4, weight: 0.10 },
      { name: "Project Management", level: 3, weight: 0.09 },
    ]
  },
  {
    id: "urban-analyst",
    name: "Urban Data Analyst",
    domain: "Smart City Systems",
    description: "Optimize city operations with data insights",
    requiredSkills: [
      { name: "Data Analysis", level: 4, weight: 0.15 },
      { name: "Urban Planning", level: 3, weight: 0.11 },
      { name: "GIS Mapping", level: 4, weight: 0.13 },
      { name: "Python", level: 4, weight: 0.12 },
      { name: "SQL", level: 4, weight: 0.11 },
      { name: "Data Visualization", level: 4, weight: 0.10 },
      { name: "IoT Fundamentals", level: 3, weight: 0.09 },
      { name: "Public Infrastructure", level: 3, weight: 0.10 },
      { name: "Stakeholder Communication", level: 4, weight: 0.09 },
    ]
  }
];

// Sample user skills (in a real app, these would come from profile)
const userSkills = [
  { name: "Data Analysis", level: 4, evidence: ["Course: Data Science Fundamentals", "Project: Healthcare Dashboard"] },
  { name: "Python", level: 4, evidence: ["Course: Advanced Python", "Project: ML Model"] },
  { name: "SQL", level: 3, evidence: ["Course: Database Management"] },
  { name: "Data Visualization", level: 3, evidence: ["Project: Dashboard Creation"] },
  { name: "Statistics", level: 3, evidence: ["Course: Statistics 101"] },
  { name: "Communication Skills", level: 4, evidence: ["Work Experience"] },
  { name: "Project Management", level: 2, evidence: ["Small Team Project"] },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState(targetTracks[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [previousAssessments, setPreviousAssessments] = useState<AssessmentResult[]>([
    {
      readinessScore: 68,
      skillRadar: [],
      missingSkills: ["Medical Terminology", "Healthcare Regulations"],
      weakSkills: ["SQL", "Statistics"],
      suggestedActions: [
        "Complete Healthcare Regulations course",
        "Practice advanced SQL queries",
        "Build a medical data analysis project",
        "Learn medical terminology basics",
        "Improve data visualization skills"
      ],
      explanation: "You have strong technical skills but need more domain-specific knowledge in healthcare.",
      timestamp: "2024-05-15"
    }
  ]);

  // Gap analysis algorithm
  const runGapAnalysis = (track: any): AssessmentResult => {
    const skillRadar: SkillGap[] = [];
    const missingSkills: string[] = [];
    const weakSkills: string[] = [];
    
    let totalWeightedScore = 0;
    let totalWeight = 0;

    // Calculate skill gaps
    track.requiredSkills.forEach((requiredSkill: any) => {
      const userSkill = userSkills.find(s => s.name === requiredSkill.name);
      const currentLevel = userSkill?.level || 0;
      const gap = Math.max(0, requiredSkill.level - currentLevel);
      
      // Classify skill importance based on weight
      let importance: 'high' | 'medium' | 'low' = 'medium';
      if (requiredSkill.weight >= 0.12) importance = 'high';
      if (requiredSkill.weight < 0.08) importance = 'low';

      skillRadar.push({
        name: requiredSkill.name,
        currentLevel,
        requiredLevel: requiredSkill.level,
        gap,
        importance,
        evidence: userSkill?.evidence || []
      });

      // Track missing and weak skills
      if (currentLevel === 0) {
        missingSkills.push(requiredSkill.name);
      } else if (gap >= 2) {
        weakSkills.push(requiredSkill.name);
      }

      // Calculate weighted score for this skill
      const skillScore = Math.min(currentLevel / requiredSkill.level, 1) * 100;
      totalWeightedScore += skillScore * requiredSkill.weight;
      totalWeight += requiredSkill.weight;
    });

    // Calculate readiness score
    const readinessScore = Math.round(totalWeightedScore / totalWeight);

    // Generate explanation
    const explanation = generateExplanation(readinessScore, skillRadar, missingSkills.length, weakSkills.length);

    // Generate suggested actions
    const suggestedActions = generateSuggestedActions(skillRadar, missingSkills, weakSkills);

    return {
      readinessScore,
      skillRadar,
      missingSkills,
      weakSkills,
      suggestedActions,
      explanation,
      timestamp: new Date().toISOString()
    };
  };

  const generateExplanation = (score: number, skillRadar: SkillGap[], missingCount: number, weakCount: number): string => {
    if (score >= 85) {
      return `Excellent! You're highly prepared for this role. Your score of ${score}% shows you have strong alignment with required skills.`;
    } else if (score >= 70) {
      return `Good progress! Your score of ${score}% indicates solid foundation with ${missingCount > 0 ? `${missingCount} missing skills` : 'no major gaps'} and ${weakCount > 0 ? `${weakCount} areas to strengthen` : 'minor improvements needed'}.`;
    } else if (score >= 50) {
      return `You're on the right track. Your score of ${score}% shows you have basic competency but need to focus on ${missingCount + weakCount} key areas.`;
    } else {
      return `Foundational work needed. Your score of ${score}% indicates significant gaps in ${missingCount} required skills. Focus on building core competencies first.`;
    }
  };

  const generateSuggestedActions = (skillRadar: SkillGap[], missing: string[], weak: string[]): string[] => {
    const actions: string[] = [];
    
    // Prioritize high importance missing skills
    const highPriorityMissing = skillRadar
      .filter(s => missing.includes(s.name) && s.importance === 'high')
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 2);
    
    highPriorityMissing.forEach(skill => {
      actions.push(`Learn ${skill.name} fundamentals through beginner courses`);
    });

    // Address biggest gaps
    const biggestGaps = [...skillRadar]
      .filter(s => s.gap > 0)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 2);
    
    biggestGaps.forEach(skill => {
      if (!actions.includes(`Improve ${skill.name} from level ${skill.currentLevel} to ${skill.requiredLevel}`)) {
        actions.push(`Improve ${skill.name} from level ${skill.currentLevel} to ${skill.requiredLevel}`);
      }
    });

    // Add practice recommendations
    if (weak.length > 0) {
      actions.push(`Practice ${weak[0]} through hands-on projects`);
    }

    // Add evidence building
    const lowEvidenceSkills = skillRadar
      .filter(s => s.evidence.length === 0 && s.currentLevel > 0)
      .slice(0, 1);
    
    if (lowEvidenceSkills.length > 0) {
      actions.push(`Build evidence for ${lowEvidenceSkills[0].name} through certification or project`);
    }

    // Fill remaining slots with general recommendations
    while (actions.length < 5) {
      const generalActions = [
        "Complete at least one project in this domain",
        "Network with professionals in this field",
        "Attend industry-relevant webinars or conferences",
        "Join online communities for skill development",
        "Create a learning schedule and track progress"
      ];
      actions.push(generalActions[actions.length % generalActions.length]);
    }

    return actions.slice(0, 5);
  };

  const handleRunAssessment = () => {
    setIsRunning(true);
    
    // Simulate analysis processing
    setTimeout(() => {
      const assessmentResult = runGapAnalysis(selectedTrack);
      setResult(assessmentResult);
      
      // Save to history
      setPreviousAssessments(prev => [assessmentResult, ...prev.slice(0, 4)]);
      setIsRunning(false);
    }, 1500);
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `skill-assessment-${selectedTrack.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      alert('Assessment report downloaded successfully!');
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Work";
  };

  const renderSkillRadarChart = () => {
    if (!result) return null;

    return (
      <div className="relative w-64 h-64 mx-auto">
        {/* Radar Chart Grid */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circles */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          
          {/* Skill points */}
          {result.skillRadar.slice(0, 8).map((skill, index) => {
            const angle = (index * 2 * Math.PI) / Math.min(result.skillRadar.length, 8);
            const requiredRadius = 40 * (skill.requiredLevel / 5);
            const currentRadius = 40 * (skill.currentLevel / 5);
            
            const requiredX = 50 + requiredRadius * Math.cos(angle - Math.PI / 2);
            const requiredY = 50 + requiredRadius * Math.sin(angle - Math.PI / 2);
            const currentX = 50 + currentRadius * Math.cos(angle - Math.PI / 2);
            const currentY = 50 + currentRadius * Math.sin(angle - Math.PI / 2);
            
            return (
              <g key={skill.name}>
                {/* Required level marker */}
                <circle
                  cx={requiredX}
                  cy={requiredY}
                  r="1.5"
                  fill="#3b82f6"
                  className="animate-pulse"
                />
                {/* Current level marker */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r="2"
                  fill={skill.gap === 0 ? "#10b981" : "#ef4444"}
                />
                {/* Connection line */}
                <line
                  x1={currentX}
                  y1={currentY}
                  x2={requiredX}
                  y2={requiredY}
                  stroke={skill.gap === 0 ? "#10b981" : "#ef4444"}
                  strokeWidth="0.5"
                  strokeDasharray={skill.gap === 0 ? "none" : "2,2"}
                />
              </g>
            );
          })}
        </svg>
        
        {/* Center score */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(result.readinessScore)}`}>
              {result.readinessScore}
            </div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
        </div>
      </div>
    );
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
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Skill Intelligence</h1>
                  <p className="text-sm text-gray-500">AI-Powered Skill Assessment</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Printer className="h-5 w-5" />
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
              <h2 className="text-3xl font-bold text-gray-900">Skill Gap Analysis</h2>
              <p className="text-gray-600 mt-2">
                Objective #2: AI-powered readiness assessment and personalized recommendations
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-full">
                Hackathon_Ingenium_PS
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Target Track Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Select Target Track</h3>
                  <p className="text-sm text-gray-500">Choose a career path to assess your readiness</p>
                </div>
                <Target className="h-5 w-5 text-blue-600" />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {targetTracks.map(track => (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedTrack.id === track.id
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mb-3">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{track.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{track.domain}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{track.description}</p>
                      <div className="mt-3 text-xs text-gray-400">
                        {track.requiredSkills.length} required skills
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Track Details */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedTrack.name}</h4>
                    <p className="text-sm text-gray-500">{selectedTrack.domain}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Required Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTrack.requiredSkills.slice(0, 4).map(skill => (
                        <span key={skill.name} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {skill.name}
                        </span>
                      ))}
                      {selectedTrack.requiredSkills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{selectedTrack.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Skill Importance</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '70%' }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Results */}
            {result && (
              <div className="space-y-6">
                {/* Readiness Score */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Readiness Score</h3>
                      <p className="text-sm text-gray-500">Your overall preparedness for {selectedTrack.name}</p>
                    </div>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                    >
                      {showExplanation ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                      {showExplanation ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Score Gauge */}
                    <div className="relative w-48 h-48 mb-6 md:mb-0">
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
                        {/* Score circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={getScoreBgColor(result.readinessScore)}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${result.readinessScore * 2.83} 283`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-bold ${getScoreColor(result.readinessScore)}`}>
                          {result.readinessScore}
                        </span>
                        <span className="text-gray-500">out of 100</span>
                        <div className={`mt-2 px-3 py-1 ${getScoreBgColor(result.readinessScore)} text-white text-sm font-medium rounded-full`}>
                          {getScoreLabel(result.readinessScore)}
                        </div>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Skill Alignment</span>
                          <span className="text-sm font-medium text-green-600">
                            {Math.round((result.skillRadar.filter(s => s.gap === 0).length / result.skillRadar.length) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(result.skillRadar.filter(s => s.gap === 0).length / result.skillRadar.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Gap Severity</span>
                          <span className="text-sm font-medium text-yellow-600">
                            {result.skillRadar.filter(s => s.gap >= 2).length} skills
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${(result.skillRadar.filter(s => s.gap >= 2).length / result.skillRadar.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Evidence Strength</span>
                          <span className="text-sm font-medium text-blue-600">
                            {Math.round((result.skillRadar.filter(s => s.evidence.length > 0).length / result.skillRadar.length) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${(result.skillRadar.filter(s => s.evidence.length > 0).length / result.skillRadar.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explanation Panel */}
                  {showExplanation && (
                    <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Why you scored {result.readinessScore}%
                          </h4>
                          <p className="text-sm text-gray-700">{result.explanation}</p>
                          
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="p-2 bg-white rounded-lg">
                              <div className="flex items-center space-x-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium">{result.missingSkills.length}</span>
                              </div>
                              <p className="text-xs text-gray-600">Missing Skills</p>
                            </div>
                            <div className="p-2 bg-white rounded-lg">
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">{result.weakSkills.length}</span>
                              </div>
                              <p className="text-xs text-gray-600">Weak Skills</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skill Radar */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Skill Radar Analysis</h3>
                      <p className="text-sm text-gray-500">Current vs Required skill levels</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>

                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Radar Chart */}
                    <div className="flex-1">
                      {renderSkillRadarChart()}
                      <div className="mt-4 text-center text-sm text-gray-500">
                        Blue = Required Level • Green = Met • Red = Gap
                      </div>
                    </div>

                    {/* Skill Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Skill Gaps</h4>
                        <div className="space-y-3">
                          {result.skillRadar
                            .filter(skill => skill.gap > 0)
                            .sort((a, b) => b.gap - a.gap)
                            .slice(0, 4)
                            .map(skill => (
                              <div key={skill.name} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">{skill.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-green-600">L{skill.currentLevel}</span>
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm text-blue-600">L{skill.requiredLevel}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                                    <div
                                      className={`h-full ${
                                        skill.importance === 'high' ? 'bg-red-500' :
                                        skill.importance === 'medium' ? 'bg-yellow-500' :
                                        'bg-blue-500'
                                      }`}
                                      style={{ width: `${(skill.currentLevel / skill.requiredLevel) * 100}%` }}
                                    />
                                  </div>
                                  <span className={`text-xs font-medium ${
                                    skill.importance === 'high' ? 'text-red-600' :
                                    skill.importance === 'medium' ? 'text-yellow-600' :
                                    'text-blue-600'
                                  }`}>
                                    {skill.importance.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Missing & Weak Skills */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Missing Skills */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <XCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Missing Skills</h4>
                        <p className="text-sm text-gray-500">Required skills you don't have yet</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {result.missingSkills.length > 0 ? (
                        result.missingSkills.map(skill => (
                          <div key={skill} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-gray-900">{skill}</span>
                            </div>
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                              Missing
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-green-700">No missing skills! Great job!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weak Skills */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Weak Skills</h4>
                        <p className="text-sm text-gray-500">Skills that need improvement</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {result.weakSkills.length > 0 ? (
                        result.weakSkills.map(skill => {
                          const skillData = result.skillRadar.find(s => s.name === skill);
                          return (
                            <div key={skill} className="p-3 bg-yellow-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{skill}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-yellow-600">L{skillData?.currentLevel}</span>
                                  <ArrowRight className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm text-blue-600">L{skillData?.requiredLevel}</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600">
                                Gap: {skillData?.gap} level{skillData?.gap !== 1 ? 's' : ''}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-green-700">No weak skills! You're doing great!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggested Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Suggested Next Actions</h3>
                      <p className="text-sm text-gray-500">Top 5 recommendations to improve your readiness</p>
                    </div>
                    <Rocket className="h-5 w-5 text-blue-600" />
                  </div>

                  <div className="space-y-4">
                    {result.suggestedActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{action}</p>
                          <div className="mt-2 flex items-center space-x-3 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {index < 2 ? 'Priority' : 'Recommended'}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {index < 2 ? 'High Impact' : 'Medium Impact'}
                            </span>
                          </div>
                        </div>
                        <button className="flex-shrink-0 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & History */}
          <div className="space-y-8">
            {/* Run Assessment Button */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Run Gap Analysis</h3>
              </div>
              
              <p className="text-blue-100 mb-6">
                Analyze your skills against the {selectedTrack.name} role requirements using our AI-powered algorithm.
              </p>
              
              <button
                onClick={handleRunAssessment}
                disabled={isRunning}
                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${
                  isRunning
                    ? 'bg-blue-700 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg'
                }`}
              >
                {isRunning ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                    Analyzing Skills...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Run Assessment
                  </div>
                )}
              </button>
              
              <div className="mt-4 text-xs text-blue-200">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Your data is processed securely and anonymously
                </div>
              </div>
            </div>

            {/* Export Report */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Report</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleExportReport}
                  disabled={!result || isExporting}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-300 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <DownloadCloud className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Download PDF Report</p>
                      <p className="text-sm text-gray-500">Detailed analysis with charts</p>
                    </div>
                  </div>
                  {isExporting ? (
                    <RefreshCw className="animate-spin h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:border-green-300 transition-colors">
                  <div className="flex items-center">
                    <Share2 className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Share Results</p>
                      <p className="text-sm text-gray-500">With mentor or team</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl hover:border-purple-300 transition-colors">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">View Job Matches</p>
                      <p className="text-sm text-gray-500">Based on your score</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Previous Assessments */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment History</h3>
              
              <div className="space-y-4">
                {previousAssessments.map((assessment, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => setResult(assessment)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getScoreBgColor(assessment.readinessScore)}`} />
                        <span className="font-medium text-gray-900">
                          {assessment.readinessScore}% Readiness
                        </span>
                      </div>
                      <span className="text-xs text-gray-500" suppressHydrationWarning>
                        {new Date(assessment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {assessment.explanation}
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
                        {assessment.missingSkills.length} missing
                      </span>
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">
                        {assessment.weakSkills.length} weak
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithm Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Weighted Skill Analysis</h4>
                    <p className="text-sm text-gray-600">Skills are weighted by importance in the target role</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Evidence Confidence</h4>
                    <p className="text-sm text-gray-600">Skills with documented evidence score higher</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">AI-Powered Insights</h4>
                    <p className="text-sm text-gray-600">Personalized recommendations based on your gaps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}