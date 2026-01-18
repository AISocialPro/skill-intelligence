import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = supabaseServer();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/auth/login");

  const { data: course, error } = await supabase
    .from("user_courses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !course) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-semibold">Course not found</h1>
        <p className="text-gray-500 mt-2">
          This course does not exist or you don’t have access.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link
          href="/profile?tab=courses"
          className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Courses
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {course.title}
          </h1>

          <p className="text-gray-600 mt-2">
            {course.description || "No description provided."}
          </p>

          {/* Meta Info */}
          <div className="grid md:grid-cols-2 gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span><b>Provider:</b> {course.provider}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>
                <b>Completed:</b>{" "}
                {course.completion_date
                  ? new Date(course.completion_date).toDateString()
                  : "—"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span><b>Duration:</b> {course.duration || "—"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-500" />
              <span><b>Certificate ID:</b> {course.certificate_id || "—"}</span>
            </div>
          </div>

          {/* Skills */}
          {course.skills?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">
                Skills Developed
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Link */}
          {course.link && (
            <div className="mt-8">
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Open Original Course
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
