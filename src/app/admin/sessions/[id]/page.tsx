import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SessionDetail } from "@/components/admin/SessionDetail";

export default async function SessionDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const authResult = await supabase.auth.getUser();
  if (!authResult.data.user) redirect("/login");

  const resolvedParams = await props.params;

  return (
    <div className="space-y-6">
      <SessionDetail id={resolvedParams.id} />
    </div>
  );
}
