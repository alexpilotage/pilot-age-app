import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(name)")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "salarie") {
    redirect("/espace");
  }

  const orgName = (profile.organizations as { name: string } | null)?.name;

  return (
    <AppShell
      role="admin_entreprise"
      userName={`${profile.first_name} ${profile.last_name}`}
      organizationName={orgName || undefined}
    >
      {children}
    </AppShell>
  );
}
