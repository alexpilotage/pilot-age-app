import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default async function EspaceLayout({
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

  const orgName = (profile?.organizations as { name: string } | null)?.name;

  return (
    <AppShell
      role="salarie"
      userName={
        profile ? `${profile.first_name} ${profile.last_name}` : undefined
      }
      organizationName={orgName || undefined}
    >
      {children}
    </AppShell>
  );
}
