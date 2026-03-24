import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QuestionForm } from "@/components/admin/QuestionForm";

export default async function NewQuestionPage() {
  const supabase = await createClient();
  const authResult = await supabase.auth.getUser();
  if (!authResult.data.user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nouvelle question</h1>
        <p className="text-sm text-muted-foreground">
          Ajoutez une question au questionnaire
        </p>
      </div>
      <QuestionForm />
    </div>
  );
}
