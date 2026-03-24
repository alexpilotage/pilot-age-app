import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth";

// GET — Get session detail with responses
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Non autoris\u00e9" }, { status: 401 });
  }

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  const supabase = createAdminClient();

  const { data: session, error } = await supabase
    .from("questionnaire_sessions")
    .select("*, organizations(name, slug)")
    .eq("id", id)
    .single();

  if (error || !session) {
    return NextResponse.json(
      { error: "Session non trouv\u00e9e" },
      { status: 404 }
    );
  }

  // Get responses for this session
  const { data: responses } = await supabase
    .from("questionnaire_responses")
    .select("id, score, profile_type, created_at")
    .eq("session_id", id)
    .order("created_at", { ascending: false });

  const result = Object.assign({}, session, { responses: responses || [] });
  return NextResponse.json(result);
}

// PATCH — Update session (close/reopen)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Non autoris\u00e9" }, { status: 401 });
  }

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  const supabase = createAdminClient();
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.status) {
    updates.status = body.status;
    if (body.status === "completed") {
      updates.ended_at = new Date().toISOString();
    }
    if (body.status === "active") {
      updates.ended_at = null;
    }
  }

  const { data: session, error } = await supabase
    .from("questionnaire_sessions")
    .update(updates)
    .eq("id", id)
    .select("*, organizations(name)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(session);
}

// DELETE — Delete session and its responses
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireSuperAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Non autoris\u00e9" }, { status: 401 });
  }

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  const supabase = createAdminClient();

  // Delete responses first
  await supabase
    .from("questionnaire_responses")
    .delete()
    .eq("session_id", id);

  const { error } = await supabase
    .from("questionnaire_sessions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
