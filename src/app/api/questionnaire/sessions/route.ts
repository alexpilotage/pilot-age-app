import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.organization_id) {
    return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
  }

  const { data: sessions, error } = await supabase
    .from("questionnaire_sessions")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    !["super_admin", "admin_entreprise"].includes(profile.role)
  ) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  if (!profile.organization_id) {
    return NextResponse.json(
      { error: "Organisation non trouvée" },
      { status: 404 }
    );
  }

  const code = generateSessionCode();

  const { data: session, error } = await supabase
    .from("questionnaire_sessions")
    .insert({
      organization_id: profile.organization_id,
      code,
      status: "active",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(session, { status: 201 });
}

function generateSessionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
