import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CompanyDetail } from "@/components/admin/CompanyDetail";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (!company) {
    notFound();
  }

  const { data: sessions } = await supabase
    .from("questionnaire_sessions")
    .select("*")
    .eq("organization_id", id)
    .order("created_at", { ascending: false });

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", id);

  const companyData = Object.assign({}, company, {
    sessions: sessions || [],
    users: users || [],
  });

  return <CompanyDetail company={companyData} />;
}
