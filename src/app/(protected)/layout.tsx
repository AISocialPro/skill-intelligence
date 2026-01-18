import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
