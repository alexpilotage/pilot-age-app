import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Public endpoint — validates a session code (no auth required).
// Uses admin client to bypass RLS.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Code manquant" },
      { status: 400 }
    );
  }

  try {
    const supabase = createAdminClient();

    const { data: session, error } = await supabase
      .from("questionnaire_sessions")
      .select("id, code, status, organization_id")
      .eq("code", code)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { valid: false, reason: "Session introuvable" },
        { status: 404 }
      );
    }

    if (session.status !== "active") {
      return NextResponse.json(
        { valid: false, reason: "Cette session n'est plus active" },
        { status: 403 }
      );
    }

    // Get organization name for display
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", session.organization_id)
      .single();

    return NextResponse.json({
      valid: true,
      session_id: session.id,
      organization_name: org?.name || null,
    });
  } catch (err) {
    console.error("[validate] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
