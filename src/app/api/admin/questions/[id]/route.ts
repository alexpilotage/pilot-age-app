import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth";

// GET — Get single question
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireSuperAdmin();
  if (authError) return authError;

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  const supabase = createAdminClient();

  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !question) {
    return NextResponse.json(
      { error: "Question non trouvée" },
      { status: 404 }
    );
  }

  return NextResponse.json(question);
}

// PATCH — Update question
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireSuperAdmin();
  if (authError) return authError;

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  const supabase = createAdminClient();
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.text !== undefined) updates.text = body.text;
  if (body.type !== undefined) updates.type = body.type;
  if (body.options !== undefined) updates.options = body.options;
  if (body.weight !== undefined) updates.weight = body.weight;
  if (body.is_active !== undefined) updates.is_active = body.is_active;

  const { data: question, error } = await supabase
    .from("questions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(question);
}

// DELETE — Delete question
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireSuperAdmin();
  if (authError) return authError;

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
