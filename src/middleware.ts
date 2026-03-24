import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/auth/callback", "/dev-login"];

// Routes accessible via QR code (anonymous)
const QUESTIONNAIRE_ROUTE = /^\/q\/[a-zA-Z0-9-]+/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return await updateSession(request);
  }

  // Allow anonymous questionnaire access
  if (QUESTIONNAIRE_ROUTE.test(pathname)) {
    return await updateSession(request);
  }

  // === DEV MODE: bypass auth with dev-role cookie ===
  const isDev = process.env.NODE_ENV === "development";
  const devRole = request.cookies.get("dev-role")?.value;

  if (isDev && devRole) {
    const response = NextResponse.next({ request });

    // Role-based routing for dev mode
    if (pathname.startsWith("/admin") && devRole !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard") && devRole === "salarie") {
      return NextResponse.redirect(new URL("/espace", request.url));
    }

    return response;
  }

  // === PRODUCTION: Supabase auth ===
  const response = await updateSession(request);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as never)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "salarie") {
      return NextResponse.redirect(new URL("/espace", request.url));
    }
  }

  return response;
}

/**
 * Refreshes the user session and updates cookies.
 */
async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as never)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
