import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * OAuth callback handler.
 * Exchanges the auth code for a session, then redirects
 * based on the user's role.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get user profile to determine redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // Role-based redirect
        if (profile?.role === "super_admin") {
          return NextResponse.redirect(`${origin}/admin`);
        } else if (profile?.role === "admin_entreprise") {
          return NextResponse.redirect(`${origin}/dashboard`);
        } else if (profile?.role === "salarie") {
          return NextResponse.redirect(`${origin}/espace`);
        }
      }

      // Default redirect
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
