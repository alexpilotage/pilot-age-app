import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QuestionForm } from "@/components/admin/QuestionForm";

export default async function EditQuestionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const authResult = await supabase.auth.getUser();
  if (!authResult.data.user) redirect("/login");

  const resolvedParams = await props.params;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Modifier la question</h1>
        <p className="text-sm text-muted-foreground">
          Modifiez le contenu et les param\u00e8tres de la question
        </p>
      </div>
      <QuestionForm questionId={resolvedParams.id} />
    </div>
  );
}
