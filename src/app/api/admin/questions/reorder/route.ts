import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth";

// POST — Reorder questions by providing ordered IDs
export async function POST(request: Request) {
  const authError = await requireSuperAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const body = await request.json();
  const { orderedIds } = body;

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json(
      { error: "orderedIds doit \u00eatre un tableau" },
      { status: 400 }
    );
  }

  // Update each question's order_index
  const updates = orderedIds.map((id: string, index: number) =>
    supabase
      .from("questions")
      .update({ order_index: index })
      .eq("id", id)
  );

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}
