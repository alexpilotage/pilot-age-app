import { NextResponse } from "next/server";

// Temporary debug endpoint — remove after troubleshooting
export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    commit: "d9f7fdbd+debug",
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING",
    },
  };

  // Try admin client
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    checks.adminClient = "OK";

    // Try querying sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from("questionnaire_sessions")
      .select("id, code, status")
      .limit(5);

    if (sessionsError) {
      checks.sessions = { error: sessionsError.message, code: sessionsError.code };
    } else {
      checks.sessions = { count: sessions?.length ?? 0, data: sessions };
    }

    // Try querying questions
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, text, type, is_active")
      .limit(5);

    if (questionsError) {
      checks.questions = { error: questionsError.message, code: questionsError.code };
    } else {
      checks.questions = { count: questions?.length ?? 0, data: questions };
    }
  } catch (err) {
    checks.adminClient = {
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }

  return NextResponse.json(checks, { status: 200 });
}
