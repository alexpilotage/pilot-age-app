import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Public endpoint — no auth required.
// Uses admin client to bypass RLS (anonymous questionnaire access).
export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: questions, error } = await supabase
      .from("questions")
      .select("id, text, type, options, order_index")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(questions);
  } catch (err) {
    console.error("[questions] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
