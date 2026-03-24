import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: session, error } = await supabase
    .from("questionnaire_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !session) {
    return NextResponse.json(
      { error: "Session non trouvée" },
      { status: 404 }
    );
  }

  // Get aggregated stats (anonymous)
  const { data: responses } = await supabase
    .from("questionnaire_responses")
    .select("profile_type, score")
    .eq("session_id", id);

  const stats = {
    total: responses?.length || 0,
    aidant_probable:
      responses?.filter((r) => r.profile_type === "aidant_probable").length ||
      0,
    aidant_possible:
      responses?.filter((r) => r.profile_type === "aidant_possible").length ||
      0,
    non_aidant:
      responses?.filter((r) => r.profile_type === "non_aidant").length || 0,
    average_score:
      responses && responses.length > 0
        ? Math.round(
            responses.reduce((sum, r) => sum + Number(r.score), 0) /
              responses.length
          )
        : 0,
  };

  return NextResponse.json({ session, stats });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body;

  if (!["draft", "active", "closed"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { status };
  if (status === "active") updateData.started_at = new Date().toISOString();
  if (status === "closed") updateData.closed_at = new Date().toISOString();

  const { data: session, error } = await supabase
    .from("questionnaire_sessions")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(session);
}
