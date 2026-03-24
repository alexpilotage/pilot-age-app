import { createClient } from "@/lib/supabase/server";

/**
 * Verify the current user is a super_admin.
 * Returns { user, supabase } if authorized, null otherwise.
 */
export async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") return null;
  return { user, supabase };
}
