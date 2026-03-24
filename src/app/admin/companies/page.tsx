import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CompanyList } from "@/components/admin/CompanyList";

export default async function CompaniesPage() {
  const supabase = await createClient();

  const { data: companies, error } = await supabase
    .from("organizations")
    .select("*, questionnaire_sessions(count)")
    .order("created_at", { ascending: false });

  if (error) {
    redirect("/admin");
  }

  return <CompanyList initialCompanies={companies || []} />;
}
