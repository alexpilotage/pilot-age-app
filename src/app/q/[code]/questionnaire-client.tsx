"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import { ResultCard } from "@/components/questionnaire/ResultCard";

interface Question {
  id: string;
  text: string;
  type: "yes_no" | "scale" | "single_choice" | "multiple_choice";
  options: string[] | null;
  order_index: number;
}

interface Result {
  score: number;
  profile_type: "aidant_probable" | "aidant_possible" | "non_aidant";
}

function getRespondentToken(code: string): string {
  const key = `pa_respondent_${code}`;
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

export function QuestionnaireClient({ code }: { code: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Step 1: Validate the session code
        const validateRes = await fetch(`/api/questionnaire/validate?code=${encodeURIComponent(code)}`);

        if (!validateRes.ok) {
          let reason = "Session introuvable ou expirée.";
          try {
            const data = await validateRes.json();
            reason = data.reason || data.error || reason;
          } catch {
            // Response wasn't JSON
          }
          setError(reason);
          setLoading(false);
          return;
        }

        const validateData = await validateRes.json();
        if (!validateData.valid) {
          setError(validateData.reason || "Session introuvable ou expirée.");
          setLoading(false);
          return;
        }

        if (validateData.organization_name) {
          setOrgName(validateData.organization_name);
        }

        // Step 2: Load questions
        const questionsRes = await fetch("/api/questionnaire/questions");

        if (!questionsRes.ok) {
          let reason = "Impossible de charger les questions.";
          try {
            const data = await questionsRes.json();
            reason = data.error || reason;
          } catch {
            // Response wasn't JSON
          }
          setError(reason);
          setLoading(false);
          return;
        }

        const questionsData = await questionsRes.json();

        if (!questionsData || questionsData.length === 0) {
          setError("Aucune question n'est disponible pour le moment. Veuillez contacter votre entreprise.");
          setLoading(false);
          return;
        }

        setQuestions(questionsData);
      } catch (err) {
        console.error("Questionnaire load error:", err);
        setError("Impossible de charger le questionnaire. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  const handleAnswer = useCallback(
    (value: unknown) => {
      const question = questions[currentIndex];
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    },
    [questions, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);

    try {
      const respondent_token = getRespondentToken(code);
      const res = await fetch("/api/questionnaire/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_code: code,
          answers,
          respondent_token,
        }),
      });

      if (res.status === 409) {
        setAlreadyAnswered(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la soumission");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la soumission"
      );
    } finally {
      setSubmitting(false);
    }
  }, [code, answers]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-12 h-12 border-4 border-[#FFCF02] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#6B6B6B]">Chargement du questionnaire...</p>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl mb-4 block">⚠️</span>
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#181818] text-white rounded-xl hover:bg-[#333]"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (alreadyAnswered) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl mb-4 block">✅</span>
        <h2 className="text-2xl font-bold text-[#181818] mb-4 font-[family-name:var(--font-playfair)]">
          Vous avez déjà répondu
        </h2>
        <p className="text-[#6B6B6B]">
          Vous avez déjà soumis vos réponses pour ce questionnaire. Merci !
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#181818] mb-8 text-center font-[family-name:var(--font-playfair)]">
          Votre résultat
        </h1>
        <ResultCard score={result.score} profileType={result.profile_type} />
        <p className="text-center text-sm text-[#6B6B6B] mt-8">
          Merci pour votre participation. Vous pouvez fermer cette page.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6B6B6B]">Erreur de chargement. Veuillez rafraîchir la page.</p>
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnswer = currentAnswer !== undefined && currentAnswer !== null;

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#181818] mb-3 font-[family-name:var(--font-playfair)]">
          Êtes-vous aidant(e) ?
        </h1>
        <p className="text-[#6B6B6B]">
          Répondez à ces quelques questions pour le découvrir.
        </p>
        {orgName && (
          <p className="text-sm text-[#6B6B6B] mt-2">
            Questionnaire proposé par <span className="font-medium text-[#181818]">{orgName}</span>
          </p>
        )}
      </div>

      <div className="mb-8">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          answer={currentAnswer}
          onAnswer={handleAnswer}
          index={currentIndex}
        />
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-xl text-[#6B6B6B] hover:bg-[#E8E8E6] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Précédent
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswer || submitting}
            className="px-8 py-3 bg-[#FFCF02] text-[#181818] font-semibold rounded-xl hover:bg-[#e6ba00] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? "Envoi..." : "Voir mon résultat"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="px-8 py-3 bg-[#181818] text-white font-semibold rounded-xl hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Suivant →
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center mt-4">{error}</p>
      )}
    </div>
  );
}
