import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client — uses the service role key.
 * Use ONLY in server-side code (API routes, server actions).
 * Bypasses RLS — handle with care.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
