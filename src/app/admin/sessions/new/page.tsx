import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SessionForm } from "@/components/admin/SessionForm";

export default async function NewSessionPage() {
  const supabase = await createClient();
  const authResult = await supabase.auth.getUser();
  if (!authResult.data.user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nouvelle session</h1>
        <p className="text-sm text-muted-foreground">
          Créez une session de questionnaire pour une entreprise
        </p>
      </div>
      <SessionForm />
    </div>
  );
}
