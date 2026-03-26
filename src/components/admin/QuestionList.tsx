"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
  weight: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  yes_no: "Oui / Non",
  scale: "Échelle 1-5",
  single_choice: "Choix unique",
  multiple_choice: "Choix multiple",
};

export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    const res = await fetch("/api/admin/questions");
    if (res.ok) {
      const data = await res.json();
      setQuestions(data);
    }
    setLoading(false);
  }

  async function moveQuestion(index: number, direction: "up" | "down") {
    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;

    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[targetIndex];
    newQuestions[targetIndex] = temp;

    setQuestions(newQuestions);
    setReordering(true);

    const orderedIds = newQuestions.map((q) => q.id);
    await fetch("/api/admin/questions/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });

    setReordering(false);
  }

  async function toggleActive(question: Question) {
    const res = await fetch("/api/admin/questions/" + question.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !question.is_active }),
    });
    if (res.ok) {
      fetchQuestions();
    }
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Supprimer cette question ?")) return;
    const res = await fetch("/api/admin/questions/" + id, {
      method: "DELETE",
    });
    if (res.ok) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Aucune question créée
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoutez des questions pour construire le questionnaire
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reordering && (
        <p className="text-xs text-muted-foreground animate-pulse">Réorganisation...</p>
      )}
      {questions.map((question, index) => (
        <div
          key={question.id}
          className={
            "rounded-xl border bg-card p-5 transition-all " +
            (question.is_active ? "border-border" : "border-border/50 opacity-60")
          }
        >
          <div className="flex items-start gap-4">
            {/* Reorder buttons */}
            <div className="flex flex-col gap-1 pt-1">
              <button
                onClick={() => moveQuestion(index, "up")}
                disabled={index === 0 || reordering}
                className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                title="Monter"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => moveQuestion(index, "down")}
                disabled={index === questions.length - 1 || reordering}
                className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                title="Descendre"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Question content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">
                  Q{index + 1}
                </span>
                <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {TYPE_LABELS[question.type] || question.type}
                </span>
                <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Poids: {question.weight}
                </span>
                {!question.is_active && (
                  <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                    Désactivée
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground">{question.text}</p>
              {question.options && question.options.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {(Array.isArray(question.options) ? question.options : []).map((opt, i) => (
                    <span
                      key={i}
                      className="inline-flex rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {String(opt)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleActive(question)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
                title={question.is_active ? "Désactiver" : "Activer"}
              >
                {question.is_active ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
              <Link
                href={"/admin/questions/" + question.id + "/edit"}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
                title="Modifier"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
