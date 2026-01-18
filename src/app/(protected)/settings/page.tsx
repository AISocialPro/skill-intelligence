"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Building,
  Target,
  Globe,
  Calendar,
  Key,
  AlertTriangle,
  CheckCircle,
  X,
  Sparkles,
  Lock,
  Database,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  jobTitle: string;
  experience: string;
  education: string;
  preferredDomain: string;
  targetRole: string;
  careerLevel: string;
  notifications: {
    email: boolean;
    push: boolean;
    weeklyDigest: boolean;
    skillUpdates: boolean;
  };
  privacy: {
    profileVisible: boolean;
    skillsPublic: boolean;
    achievementsPublic: boolean;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    id: "user_123",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "TechHealth Inc.",
    jobTitle: "Data Analyst",
    experience: "3-5 years",
    education: "Master's in Data Science",
    preferredDomain: "healthcare",
    targetRole: "Healthcare Data Analyst",
    careerLevel: "mid",
    notifications: {
      email: true,
      push: true,
      weeklyDigest: true,
      skillUpdates: true,
    },
    privacy: {
      profileVisible: true,
      skillsPublic: true,
      achievementsPublic: false,
    },
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'privacy' | 'data'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  // Available domains and roles (would come from backend)
  const domains = [
    { id: "healthcare", name: "Healthcare & Life Sciences" },
    { id: "agriculture", name: "Agriculture & Food Tech" },
    { id: "urban", name: "Urban Development & Smart Cities" },
    { id: "tech", name: "Technology & Innovation" },
  ];

  const careerLevels = [
    { id: "entry", name: "Entry Level (0-2 years)" },
    { id: "mid", name: "Mid Level (3-7 years)" },
    { id: "senior", name: "Senior Level (8+ years)" },
    { id: "lead", name: "Lead/Manager" },
  ];

  // Load profile data on mount
  useEffect(() => {
    // In production, this would fetch from backend
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        const mergedProfile = {
          ...profile,
          ...parsed,
          notifications: { ...profile.notifications, ...(parsed.notifications || {}) },
          privacy: { ...profile.privacy, ...(parsed.privacy || {}) }
        };
        setProfile(mergedProfile);
        setFormData(mergedProfile);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
  }, []);

  // Save to localStorage when profile changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: keyof UserProfile['notifications'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handlePrivacyChange = (field: keyof UserProfile['privacy'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const saveProfile = () => {
    setProfile(formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const exportData = (format: 'json' | 'csv' | 'pdf') => {
    // In production, this would generate and download the file
    alert(`Exporting data as ${format.toUpperCase()}...`);
    setShowExportOptions(false);
  };

  const handleDeleteAccount = () => {
    // In production, this would call backend API
    alert("Account deletion requested. You'll receive a confirmation email.");
    setShowDeleteConfirm(false);
    router.push("/");
  };

  const handleLogout = async () => {
    try {
      const supabase = supabaseBrowser();

      await supabase.auth.signOut();

      // (optional) local storage cleanup if you used it earlier
      localStorage.removeItem("userProfile");
      localStorage.removeItem("onboarding_completed");

      router.push("/auth/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
      alert("Logout failed. Please try again.");
    }
  };

  const forceLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (<div className="min-h-screen text-gray-900 bg-gradient-to-br from-gray-50 to-indigo-50/30">
    
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
                <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl">
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-500">Manage your profile and preferences</p>
                </div>
              </div>
            </div>

            {saved && (
              <div className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                Changes saved successfully
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {profile.name.charAt(0)}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-500">{profile.jobTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{profile.company}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'profile', label: 'Profile Information', icon: User },
                  { id: 'preferences', label: 'Career Preferences', icon: Target },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
                  { id: 'data', label: 'Data Management', icon: Database },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  ><item.icon className="h-5 w-5 mr-3 text-gray-900" />
                    
                    {item.label}
                    {activeTab === item.id && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-6 w-6 text-blue-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                        <p className="text-sm text-gray-500">Update your personal details</p>
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setFormData(profile);
                            setIsEditing(false);
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveProfile}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700"
                        >
                          <Save className="h-4 w-4 inline mr-2" />
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">{profile.name}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">{profile.email}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">{profile.phone}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">{profile.location}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Building className="h-4 w-4 inline mr-1" />
                        Company
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">{profile.company}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">{profile.jobTitle}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Experience Level
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="0-2 years">0-2 years (Entry Level)</option>
                          <option value="3-5 years">3-5 years (Mid Level)</option>
                          <option value="6-10 years">6-10 years (Senior Level)</option>
                          <option value="10+ years">10+ years (Expert)</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">{profile.experience}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.education}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">{profile.education}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Career Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center space-x-3">
                    <Target className="h-6 w-6 text-green-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Career Preferences</h2>
                      <p className="text-sm text-gray-500">Set your career goals and preferences</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Domain & Role Preferences</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Domain Track
                          </label>
                          <select
                            value={formData.preferredDomain}
                            onChange={(e) => handleInputChange('preferredDomain', e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {domains.map(domain => (
                              <option key={domain.id} value={domain.id}>
                                {domain.name}
                              </option>
                            ))}
                          </select>
                          <p className="text-sm text-gray-500 mt-2">
                            This determines your recommended learning paths
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Role
                          </label>
                          <input
                            type="text"
                            value={formData.targetRole}
                            onChange={(e) => handleInputChange('targetRole', e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Healthcare Data Analyst"
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            Your desired career position
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Career Level Goal
                          </label>
                          <select
                            value={formData.careerLevel}
                            onChange={(e) => handleInputChange('careerLevel', e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {careerLevels.map(level => (
                              <option key={level.id} value={level.id}>
                                {level.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <div className="flex items-start space-x-4">
                        <Sparkles className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Personalized Recommendations</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Based on your preferences, we'll recommend:
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Domain-specific learning resources
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Targeted skill development paths
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Relevant project recommendations
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Career path guidance and mentorship
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setFormData(profile)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        Reset
                      </button>
                      <button
                        onClick={saveProfile}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700"
                      >
                        <Save className="h-4 w-4 inline mr-2" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-6 w-6 text-yellow-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
                      <p className="text-sm text-gray-500">Control how and when you receive updates</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {Object.entries(formData.notifications || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {key === 'email' && 'Receive updates via email'}
                            {key === 'push' && 'Push notifications for important updates'}
                            {key === 'weeklyDigest' && 'Weekly summary of your progress'}
                            {key === 'skillUpdates' && 'Alerts for new skill recommendations'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key as any, !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                    <h4 className="font-semibold text-gray-900 mb-3">Notification Frequency</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-3 text-center border border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50">
                        <div className="font-medium text-gray-900">Real-time</div>
                        <div className="text-sm text-gray-500">Immediate alerts</div>
                      </button>
                      <button className="p-3 text-center border border-blue-500 bg-blue-50 rounded-xl">
                        <div className="font-medium text-blue-700">Daily Digest</div>
                        <div className="text-sm text-blue-600">Once per day</div>
                      </button>
                      <button className="p-3 text-center border border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50">
                        <div className="font-medium text-gray-900">Weekly</div>
                        <div className="text-sm text-gray-500">Weekly summary</div>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={saveProfile}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700"
                    >
                      Save Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Security Tab */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-purple-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Privacy & Security</h2>
                      <p className="text-sm text-gray-500">Manage your privacy settings and security</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        {Object.entries(formData.privacy || {}).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {key === 'profileVisible' && 'Allow others to see your profile'}
                                {key === 'skillsPublic' && 'Show your skills to other users'}
                                {key === 'achievementsPublic' && 'Display your achievements publicly'}
                              </p>
                            </div>
                            <button
                              onClick={() => handlePrivacyChange(key as any, !value)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                value ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50">
                          <div className="flex items-center">
                            <Key className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">Change Password</h4>
                              <p className="text-sm text-gray-500">Update your account password</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50">
                          <div className="flex items-center">
                            <Globe className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">Connected Devices</h4>
                              <p className="text-sm text-gray-500">Manage active sessions</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50">
                          <div className="flex items-center">
                            <Lock className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                              <p className="text-sm text-gray-500">Add extra security to your account</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={saveProfile}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-violet-700"
                    >
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-100">
                  <div className="flex items-center space-x-3">
                    <Database className="h-6 w-6 text-gray-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
                      <p className="text-sm text-gray-500">Export your data or delete your account</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Export Data Section */}
                  <div className="mb-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Download className="h-5 w-5 text-green-600 mr-2" />
                      Export Your Data
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <button
                        onClick={() => exportData('json')}
                        className="p-6 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 text-left"
                      >
                        <div className="font-medium text-gray-900 mb-2">JSON Format</div>
                        <p className="text-sm text-gray-500">Full data export, machine-readable</p>
                      </button>
                      <button
                        onClick={() => exportData('csv')}
                        className="p-6 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 text-left"
                      >
                        <div className="font-medium text-gray-900 mb-2">CSV Format</div>
                        <p className="text-sm text-gray-500">Spreadsheet-friendly data export</p>
                      </button>
                      <button
                        onClick={() => exportData('pdf')}
                        className="p-6 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 text-left"
                      >
                        <div className="font-medium text-gray-900 mb-2">PDF Report</div>
                        <p className="text-sm text-gray-500">Formatted report with insights</p>
                      </button>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Data Included in Export</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Profile information and preferences</li>
                            <li>• Skill assessments and progress</li>
                            <li>• Learning history and completed courses</li>
                            <li>• Project submissions and achievements</li>
                            <li>• Career pathway data and match scores</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account Section */}
                  <div>
                    <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
                      <div className="flex items-start space-x-4">
                        <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">Delete Account</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            This action cannot be undone. All your data will be permanently deleted,
                            including your profile, progress, and achievements.
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-700">
                              <X className="h-4 w-4 text-red-500 mr-2" />
                              Your profile will be removed from our systems
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <X className="h-4 w-4 text-red-500 mr-2" />
                              All learning progress will be lost
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <X className="h-4 w-4 text-red-500 mr-2" />
                              Recommendations will no longer be available
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            {!showDeleteConfirm ? (
                              <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-orange-700"
                              >
                                <Trash2 className="h-4 w-4 inline mr-2" />
                                Delete My Account
                              </button>
                            ) : (
                              <div className="space-y-4">
                                <div className="p-4 bg-white rounded-xl border border-red-300">
                                  <p className="text-red-700 font-medium mb-2">
                                    Are you absolutely sure? This action cannot be undone.
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    To confirm, please type "DELETE" in the box below:
                                  </p>
                                  <input
                                    type="text"
                                    placeholder="Type DELETE to confirm"
                                    className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                  />
                                </div>
                                <div className="flex items-center space-x-4">
                                  <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-orange-700"
                                  >
                                    Yes, Delete My Account Permanently
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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