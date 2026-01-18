import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function serverUserClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const token = auth.replace("Bearer ", "");
  const supabase = serverUserClient(token);

  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const userId = user.id;

  const { error } = await supabase.from("action_items")
    .update({ is_done: true })
    .eq("id", params.id)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
