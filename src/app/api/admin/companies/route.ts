import { requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { generateSlug } from "@/lib/slug";

// GET /api/admin/companies — List all companies
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";

  let query = auth.supabase
    .from("organizations")
    .select("*, questionnaire_sessions(count)")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,contact_email.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/admin/companies — Create a new company
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, size_range, contact_email, contact_name } = body;

  if (!name || !size_range || !contact_email || !contact_name) {
    return NextResponse.json(
      {
        error:
          "Champs requis : name, size_range, contact_email, contact_name",
      },
      { status: 400 }
    );
  }

  const slug = generateSlug(name);
  const adminClient = createAdminClient();

  // Check slug uniqueness
  const { data: existing } = await adminClient
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Une entreprise avec un nom similaire existe d\u00e9j\u00e0" },
      { status: 409 }
    );
  }

  const { data, error } = await adminClient
    .from("organizations")
    .insert({
      name,
      slug,
      size_range,
      contact_email,
      contact_name,
      subscription_status: "trial",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
