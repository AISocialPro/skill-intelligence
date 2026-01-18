"use client";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Award,
  Zap,
  Brain,
  Key,
} from "lucide-react";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setErrorMsg(null);

    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant access to your dashboard",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Your data is protected 24/7",
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Personalized skill recommendations",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "98%", label: "Satisfaction", icon: Award },
    { value: "40%", label: "Faster Growth", icon: TrendingUp },
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
                      <Key className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-black">SkillQuest</h1>
                      <p className="text-sm text-black">AI LEARNING PLATFORM</p>
                    </div>
                  </div>
                  <Link
                    href="/auth/register"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
                  >
                    New here? <span className="group-hover:underline">Sign up</span>
                  </Link>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Back</span>
                </h2>
                <p className="text-black">
                  Sign in to continue your skill development journey
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
                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center text-sm font-medium text-black">
                      <Lock className="h-4 w-4 mr-2 text-gray-400" />
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-black"
                      placeholder="Enter your password"
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
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="remember" className="text-sm text-black">
                      Remember me for 30 days
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-3" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-black">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <button
  type="button"
  onClick={() => signIn("google", { callbackUrl: "/" })}
  className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-black bg-white hover:bg-gray-50 transition-all duration-200 hover:border-blue-300 hover:shadow-sm flex items-center justify-center"
>
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
  Continue with Google
</button>

                 <button
  type="button"
  onClick={() => signIn("github", { callbackUrl: "/" })}
  className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-black bg-white hover:bg-gray-50 transition-all duration-200 hover:border-purple-300 hover:shadow-sm flex items-center justify-center"
>
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
  Continue with GitHub
</button>

                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-black">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">{feature.title}</p>
                      <p className="text-xs text-black">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                {/* Welcome Card */}
                <div className="mb-12">
                  <div className="inline-flex items-center space-x-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
                    <Sparkles className="h-6 w-6" />
                    <span className="text-lg font-medium">Continue your journey</span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-4">Your Skills Await</h3>
                    <p className="text-blue-100 mb-6">
                      Pick up right where you left off. Your personalized learning path and skill assessments are waiting for you.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                        <span className="text-sm">Personalized dashboard</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                        <span className="text-sm">Progress tracking</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                        <span className="text-sm">AI recommendations</span>
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

                {/* Security Features */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Secure & Private</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg mt-1">
                        <Shield className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Enterprise Security</h4>
                        <p className="text-sm text-blue-200">
                          Military-grade encryption protecting your data at all times
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg mt-1">
                        <CheckCircle className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Privacy First</h4>
                        <p className="text-sm text-blue-200">
                          Your data belongs to you. We never share or sell your information
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg mt-1">
                        <Zap className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">24/7 Monitoring</h4>
                        <p className="text-sm text-blue-200">
                          Continuous security monitoring and regular audits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mr-4" />
                    <div>
                      <p className="font-bold">Alex Johnson</p>
                      <p className="text-sm text-blue-200">Senior Developer</p>
                    </div>
                  </div>
                  <p className="text-blue-100 italic">
                    "SkillIntelligence helped me identify skill gaps I didn&apos;t know I had. The personalized learning path accelerated my career growth."
                  </p>
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