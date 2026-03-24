import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CompanyForm } from "@/components/admin/CompanyForm";

export default async function EditCompanyPage({
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

  return <CompanyForm company={company} />;
}
