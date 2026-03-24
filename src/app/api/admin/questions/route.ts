import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth";

// GET — List all questions ordered by order_index
export async function GET() {
  const authError = await requireSuperAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();

  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(questions);
}

// POST — Create a new question
export async function POST(request: Request) {
  const authError = await requireSuperAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const body = await request.json();

  const { text, type, options, weight } = body;

  if (!text || !type) {
    return NextResponse.json(
      { error: "text et type requis" },
      { status: 400 }
    );
  }

  // Get max order_index
  const { data: lastQuestion } = await supabase
    .from("questions")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const order_index = (lastQuestion?.order_index ?? -1) + 1;

  const { data: question, error } = await supabase
    .from("questions")
    .insert({
      text,
      type,
      options: options || null,
      weight: weight || 1,
      order_index,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(question, { status: 201 });
}
