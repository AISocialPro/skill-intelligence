"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Youtube,
  ExternalLink,
  Clock,
  Users,
  Star,
  Calendar,
  BookOpen,
  ChevronRight,
  Sparkles,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface YouTubeResource {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
  contentDetails?: {
    duration: string;
  };
}

interface Domain {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
  domain: string;
}

export default function ExternalResourcesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [resources, setResources] = useState<YouTubeResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sample domains and skills (in production, this would come from your backend)
  const domains: Domain[] = [
    { id: "tech", name: "Technology" },
    { id: "healthcare", name: "Healthcare" },
    { id: "business", name: "Business" },
    { id: "design", name: "Design" },
    { id: "marketing", name: "Marketing" },
  ];

  const skills: Skill[] = [
    { id: "react", name: "React.js", domain: "tech" },
    { id: "python", name: "Python", domain: "tech" },
    { id: "sql", name: "SQL", domain: "tech" },
    { id: "healthcare-regulations", name: "Healthcare Regulations", domain: "healthcare" },
    { id: "medical-terminology", name: "Medical Terminology", domain: "healthcare" },
    { id: "data-visualization", name: "Data Visualization", domain: "tech" },
    { id: "ui-ux", name: "UI/UX Design", domain: "design" },
    { id: "digital-marketing", name: "Digital Marketing", domain: "marketing" },
  ];

  // Duration filters
  const durations = [
    { id: "short", label: "Short (< 10 min)" },
    { id: "medium", label: "Medium (10-30 min)" },
    { id: "long", label: "Long (> 30 min)" },
  ];

  // Filter skills based on selected domain
  const filteredSkills = selectedDomain
    ? skills.filter((skill) => skill.domain === selectedDomain)
    : skills;

  // YouTube API configuration
  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

  // Generate search query based on filters
  const generateSearchQuery = () => {
    const queryParts = [];
    
    if (searchQuery) {
      queryParts.push(searchQuery);
    }
    
    if (selectedSkill) {
      const skill = skills.find(s => s.id === selectedSkill);
      if (skill) {
        queryParts.push(skill.name);
      }
    }
    
    if (selectedDomain && !selectedSkill) {
      const domain = domains.find(d => d.id === selectedDomain);
      if (domain) {
        queryParts.push(domain.name);
      }
    }
    
    // Add learning/tutorial keywords for better results
    if (queryParts.length > 0) {
      queryParts.push("tutorial", "course", "learning");
    }
    
    return queryParts.join(" ");
  };

  const fetchYouTubeResources = async () => {
    if (!YOUTUBE_API_KEY) {
      setError("YouTube API key is not configured. Please add NEXT_PUBLIC_YOUTUBE_API_KEY to your environment variables.");
      return;
    }

    const query = generateSearchQuery();
    if (!query) {
      setError("Please enter a search term or select a domain/skill");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // First, search for videos
      const searchParams = new URLSearchParams({
        part: "snippet",
        q: query,
        type: "video",
        maxResults: "20",
        key: YOUTUBE_API_KEY,
        videoEmbeddable: "true",
        relevanceLanguage: "en",
        safeSearch: "strict",
      });

      const response = await fetch(`${YOUTUBE_API_URL}?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        // Get video IDs for statistics and duration
        const videoIds = data.items.map((item: YouTubeResource) => item.id.videoId).join(",");
        
        // Fetch video statistics and content details
        const statsParams = new URLSearchParams({
          part: "statistics,contentDetails",
          id: videoIds,
          key: YOUTUBE_API_KEY,
        });

        const statsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?${statsParams}`
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          
          // Merge statistics and content details with search results
          const videosWithStats = data.items.map((item: YouTubeResource) => {
            const videoStats = statsData.items.find(
              (stat: any) => stat.id === item.id.videoId
            );
            
            return {
              ...item,
              statistics: videoStats?.statistics,
              contentDetails: videoStats?.contentDetails,
            };
          });

          // Filter by duration if selected
          let filteredVideos = videosWithStats;
          if (selectedDuration) {
            filteredVideos = videosWithStats.filter((video: YouTubeResource) => {
              if (!video.contentDetails?.duration) return true;
              
              const duration = parseDuration(video.contentDetails.duration);
              
              switch (selectedDuration) {
                case "short":
                  return duration < 600; // < 10 minutes
                case "medium":
                  return duration >= 600 && duration <= 1800; // 10-30 minutes
                case "long":
                  return duration > 1800; // > 30 minutes
                default:
                  return true;
              }
            });
          }

          setResources(filteredVideos);
        } else {
          setResources(data.items);
        }
      } else {
        setResources([]);
        setError("No resources found. Try different search terms.");
      }
    } catch (err) {
      console.error("Error fetching YouTube data:", err);
      setError("Failed to fetch resources. Please try again later.");
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse ISO 8601 duration
  const parseDuration = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = (match[1] ? parseInt(match[1]) : 0);
    const minutes = (match[2] ? parseInt(match[2]) : 0);
    const seconds = (match[3] ? parseInt(match[3]) : 0);

    return hours * 3600 + minutes * 60 + seconds;
  };

  // Format duration from seconds to readable format
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format view count
  const formatViewCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchYouTubeResources();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("");
    setSelectedSkill("");
    setSelectedDuration("");
    setResources([]);
    setHasSearched(false);
    setError(null);
  };

  // Get domain name by ID
  const getDomainName = (id: string) => {
    return domains.find(d => d.id === id)?.name || id;
  };

  // Get skill name by ID
  const getSkillName = (id: string) => {
    return skills.find(s => s.id === id)?.name || id;
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
                <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl">
                  <Youtube className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Learning Resources</h1>
                  <p className="text-sm text-gray-500">Find external learning materials</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">
                YouTube API Integration
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">External Learning Resources</h2>
              <p className="text-gray-600 mt-2">
                Objective #5: Integrate at least one external API to fetch learning resources
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-full">
                  Hackathon_Ingenium_PS
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">
                  Live YouTube API Integration
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Demo Banner */}
        <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live YouTube API Integration</h3>
              <p className="text-gray-700">
                This page demonstrates real-time integration with YouTube Data API v3. All resources are fetched 
                live from YouTube based on your selected domain, skill, and duration filters. The integration includes:
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-lg border border-red-100">
                  <div className="flex items-center space-x-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Real-time Search</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Live video search from YouTube
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-100">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Advanced Filtering</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Filter by domain, skill, and duration
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-100">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Video Statistics</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Views, likes, duration, and upload date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search learning resources
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter keywords..."
                       className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-black placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Domain Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => {
                      setSelectedDomain(e.target.value);
                      setSelectedSkill(""); // Reset skill when domain changes
                    }}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-black bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Domains</option>
                    {domains.map((domain) => (
                      <option key={domain.id} value={domain.id}>
                        {domain.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skill Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    disabled={!selectedDomain}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-black bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">All Skills</option>
                    {filteredSkills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                  {!selectedDomain && (
                    <p className="mt-1 text-xs text-gray-500">Select a domain first to filter skills</p>
                  )}
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <div className="space-y-2">
                    {durations.map((duration) => (
                      <label
                        key={duration.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="duration"
                          value={duration.id}
                          checked={selectedDuration === duration.id}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{duration.label}</span>
                      </label>
                    ))}
                    <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="duration"
                        value=""
                        checked={selectedDuration === ""}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Any Duration</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-orange-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Search Resources
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                  >
                    Clear All Filters
                  </button>
                </div>
              </form>

              {/* Current Filters */}
              {(selectedDomain || selectedSkill || selectedDuration) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDomain && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Domain: {getDomainName(selectedDomain)}
                      </span>
                    )}
                    {selectedSkill && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Skill: {getSkillName(selectedSkill)}
                      </span>
                    )}
                    {selectedDuration && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {durations.find(d => d.id === selectedDuration)?.label || selectedDuration}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Learning Resources</h3>
                  <p className="text-sm text-gray-500">
                    {hasSearched
                      ? `Found ${resources.length} resources from YouTube`
                      : "Search for learning resources using the filters"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-gray-600">YouTube API v3</span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <Loader2 className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" />
                <p className="text-gray-700">Fetching resources from YouTube...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Searching for: {generateSearchQuery()}
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="h-8 w-8 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Unable to fetch resources</h4>
                    <p className="text-gray-600">{error}</p>
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Search Query:</strong> {generateSearchQuery() || "No query generated"}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Note:</strong> This demo requires a valid YouTube Data API v3 key.
                        Add your API key to <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_YOUTUBE_API_KEY</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!loading && !error && hasSearched && resources.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <Youtube className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">No resources found</h4>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find more resources.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && resources.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {resources.map((resource) => (
                  <div
                    key={resource.id.videoId}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="relative">
                      <img
                        src={resource.snippet.thumbnails.medium.url}
                        alt={resource.snippet.title}
                        className="w-full h-48 object-cover"
                      />
                      {resource.contentDetails?.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                          {formatDuration(parseDuration(resource.contentDetails.duration))}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 line-clamp-2">
                          {resource.snippet.title}
                        </h4>
                        <a
                          href={`https://www.youtube.com/watch?v=${resource.id.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {resource.snippet.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {resource.statistics?.viewCount
                            ? formatViewCount(resource.statistics.viewCount)
                            : "Views not available"}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(resource.snippet.publishedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {resource.snippet.channelTitle.charAt(0)}
                          </div>
                          <span className="ml-2 text-sm text-gray-700 truncate">
                            {resource.snippet.channelTitle}
                          </span>
                        </div>

                        {resource.statistics?.likeCount && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 text-red-500 fill-current mr-1" />
                            {parseInt(resource.statistics.likeCount).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                        <a
                          href={`https://www.youtube.com/watch?v=${resource.id.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-red-600 hover:text-red-700 font-medium"
                        >
                          Watch on YouTube
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                        <button className="flex items-center text-gray-600 hover:text-gray-900">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* API Integration Info */}
            {hasSearched && resources.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time YouTube API Integration</h4>
                    <p className="text-sm text-gray-600">
                      These resources are fetched in real-time from YouTube Data API v3. The integration includes:
                    </p>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Search endpoint for finding relevant educational content
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Videos endpoint for fetching statistics and duration
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Client-side filtering based on duration and relevance
                      </li>
                    </ul>
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