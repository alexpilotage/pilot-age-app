import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QuestionList } from "@/components/admin/QuestionList";

export default async function AdminQuestionsPage() {
  const supabase = await createClient();
  const authResult = await supabase.auth.getUser();
  if (!authResult.data.user) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Questions</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les questions du questionnaire aidant
          </p>
        </div>
        <a
          href="/admin/questions/new"
          className="inline-flex items-center gap-2 rounded-[100px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          + Nouvelle question
        </a>
      </div>
      <QuestionList />
    </div>
  );
}
