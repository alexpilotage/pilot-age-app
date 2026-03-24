import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST — Submit anonymous questionnaire response
// Uses admin client to bypass RLS (anonymous users)
export async function POST(request: Request) {
  const supabase = createAdminClient();
  const body = await request.json();
  const { session_code, answers, respondent_token } = body;

  if (!session_code || !answers || !respondent_token) {
    return NextResponse.json(
      { error: "Données manquantes" },
      { status: 400 }
    );
  }

  // Find active session
  const { data: session, error: sessionError } = await supabase
    .from("questionnaire_sessions")
    .select("id, status")
    .eq("code", session_code)
    .single();

  if (sessionError || !session) {
    return NextResponse.json(
      { error: "Session non trouvée" },
      { status: 404 }
    );
  }

  if (session.status !== "active") {
    return NextResponse.json(
      { error: "Cette session n'est plus active" },
      { status: 403 }
    );
  }

  // Check if respondent already answered
  const { data: existing } = await supabase
    .from("questionnaire_responses")
    .select("id")
    .eq("session_id", session.id)
    .eq("respondent_token", respondent_token)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Vous avez déjà répondu à ce questionnaire" },
      { status: 409 }
    );
  }

  // Get questions for scoring
  const { data: questions } = await supabase
    .from("questions")
    .select("id, weight, type, options")
    .eq("is_active", true);

  // Calculate score
  const score = calculateScore(answers, questions || []);
  const profile_type = determineProfileType(score);

  const { data: response, error } = await supabase
    .from("questionnaire_responses")
    .insert({
      session_id: session.id,
      respondent_token,
      answers,
      score,
      profile_type,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      score,
      profile_type,
      id: response.id,
    },
    { status: 201 }
  );
}

function calculateScore(
  answers: Record<string, unknown>,
  questions: {
    id: string;
    weight: number;
    type: string;
    options: unknown;
  }[]
): number {
  let totalScore = 0;
  let maxScore = 0;

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null) continue;

    const weight = Number(question.weight);
    maxScore += weight;

    if (question.type === "yes_no") {
      if (answer === "yes" || answer === true) {
        totalScore += weight;
      }
    } else if (question.type === "scale") {
      // Scale 1-5, normalized to 0-1
      const value = Number(answer) || 0;
      totalScore += (value / 5) * weight;
    } else if (question.type === "single_choice") {
      // Score based on option index (higher index = more likely aidant)
      const options = Array.isArray(question.options)
        ? question.options
        : JSON.parse(question.options as string);
      const idx = Number(answer) || 0;
      const maxIdx = Math.max(options.length - 1, 1);
      totalScore += (idx / maxIdx) * weight;
    }
  }

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
}

function determineProfileType(
  score: number
): "aidant_probable" | "aidant_possible" | "non_aidant" {
  if (score >= 60) return "aidant_probable";
  if (score >= 30) return "aidant_possible";
  return "non_aidant";
}
