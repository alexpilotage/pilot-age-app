import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SessionList } from "@/components/admin/SessionList";

export default async function AdminSessionsPage() {
  const supabase = await createClient();
  const authResult = await supabase.auth.getUser();
  if (!authResult.data.user) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les sessions de questionnaire par entreprise
          </p>
        </div>
        <a
          href="/admin/sessions/new"
          className="inline-flex items-center gap-2 rounded-[100px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          + Nouvelle session
        </a>
      </div>
      <SessionList />
    </div>
  );
}
