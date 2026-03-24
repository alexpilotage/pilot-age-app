import { requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/admin/companies/[id]
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const auth = await requireSuperAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: company, error } = await auth.supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !company) {
    return NextResponse.json(
      { error: "Entreprise introuvable" },
      { status: 404 }
    );
  }

  const { data: sessions } = await auth.supabase
    .from("questionnaire_sessions")
    .select("*")
    .eq("organization_id", id)
    .order("created_at", { ascending: false });

  const { data: users } = await auth.supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", id);

  return NextResponse.json({
    ...company,
    sessions: sessions || [],
    users: users || [],
  });
}

// PATCH /api/admin/companies/[id]
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireSuperAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const adminClient = createAdminClient();

  const allowedFields = [
    "name",
    "size_range",
    "contact_email",
    "contact_name",
    "subscription_status",
    "subscription_start",
    "subscription_end",
    "settings",
  ];

  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Aucun champ \u00e0 mettre \u00e0 jour" },
      { status: 400 }
    );
  }

  const { data, error } = await adminClient
    .from("organizations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/admin/companies/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireSuperAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("organizations")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
