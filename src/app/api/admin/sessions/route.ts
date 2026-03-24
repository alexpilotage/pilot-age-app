import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth";

// GET — List all sessions with organization name
export async function GET() {
  const authError = await requireSuperAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();

  const { data: sessions, error } = await supabase
    .from("questionnaire_sessions")
    .select("*, organizations(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(sessions);
}

// POST — Create a new session for a specific organization
export async function POST(request: Request) {
  const authError = await requireSuperAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const body = await request.json();
  const { organization_id } = body;

  if (!organization_id) {
    return NextResponse.json(
      { error: "organization_id requis" },
      { status: 400 }
    );
  }

  // Verify org exists
  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", organization_id)
    .single();

  if (!org) {
    return NextResponse.json(
      { error: "Organisation non trouvée" },
      { status: 404 }
    );
  }

  const code = generateSessionCode();

  const { data: session, error } = await supabase
    .from("questionnaire_sessions")
    .insert({
      organization_id,
      code,
      status: "active",
      started_at: new Date().toISOString(),
    })
    .select("*, organizations(name)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(session, { status: 201 });
}

function generateSessionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
