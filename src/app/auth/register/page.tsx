"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = supabaseBrowser();

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.name },
        },
      });


      if (error) {
        if (error.message.toLowerCase().includes("user already registered")) {
          setErrorMsg("An account with this email already exists");
        } else {
          setErrorMsg(error.message || "Registration failed. Please try again.");
        }
        return;
      }

      if (authData.user) {
        await supabase.from("user_profile").upsert({
          user_id: authData.user.id,
          full_name: data.name,
          email: data.email,
        }, { onConflict: "user_id" });
      }

      setSuccessMsg("Registration successful! Please check your email to confirm your account.");
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const passwordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengths = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
    ];
    
    return strengths[Math.min(strength, 4)];
  };

  const strength = passwordStrength();

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "98%", label: "Satisfaction", icon: Award },
    { value: "40%", label: "Growth Rate", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
              {/* Header */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-black">SkillQuest</h1>
                      <p className="text-sm text-black">AI LEARNING PLATFORM</p>
                    </div>
                  </div>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
                  >
                    Already a member? <span className="group-hover:underline">Sign in</span>
                  </Link>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Community</span>
                </h2>
                <p className="text-black">
                  Create your account and start your skill development journey today
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errorMsg}</p>
                      </div>
                    </div>
                  </div>
                )}

                {successMsg && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{successMsg}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label className="flex items-center text-sm font-medium text-black mb-2">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Name
                  </label>
                  <div className="relative group">
                    <input
                      {...register("name")}
                      type="text"
                      autoComplete="name"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-black"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="flex items-center text-sm font-medium text-black mb-2">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-black"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="flex items-center text-sm font-medium text-black mb-2">
                    <Lock className="h-4 w-4 mr-2 text-gray-400" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-black"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs text-black">
                        <span>Password strength</span>
                        <span className="font-medium">{strength.label}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: `${(strength.strength + 1) * 20}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="flex items-center text-sm font-medium text-black mb-2">
                    <Lock className="h-4 w-4 mr-2 text-gray-400" />
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-black"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-black">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 text-black font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-3" />
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-4">
                  <p className="text-black">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel - Hero */}
          <div className="order-1 lg:order-2 relative">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl h-full p-8 md:p-12 lg:p-16 text-white relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -translate-x-32 translate-y-32" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center">
                {/* Data Privacy Card */}
                <div className="mb-12">
                  <div className="inline-flex items-center space-x-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
                    <Shield className="h-6 w-6" />
                    <span className="text-lg font-medium">Your data, your rules</span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-4">Security First</h3>
                    <p className="text-blue-100 mb-6">
                      Your data belongs to you, and we are committed to protecting it with enterprise-grade security measures.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                        <span className="text-sm">End-to-end encryption</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                        <span className="text-sm">GDPR compliant data handling</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                        <span className="text-sm">Regular security audits</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                    >
                      <div className="flex justify-center mb-2">
                        <stat.icon className="h-5 w-5 text-blue-300" />
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-blue-200 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Why Join SkillIntelligence?</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg mt-1">
                        <Sparkles className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">AI-Powered Assessments</h4>
                        <p className="text-sm text-blue-200">
                          Get personalized skill evaluations using advanced AI algorithms
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg mt-1">
                        <TrendingUp className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Track Your Growth</h4>
                        <p className="text-sm text-blue-200">
                          Monitor your progress with detailed analytics and insights
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg mt-1">
                        <Users className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Join a Community</h4>
                        <p className="text-sm text-blue-200">
                          Connect with professionals and experts in your field
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}