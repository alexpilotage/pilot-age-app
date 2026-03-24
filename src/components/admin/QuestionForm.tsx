"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface QuestionFormProps {
  questionId?: string;
}

export function QuestionForm({ questionId }: QuestionFormProps) {
  const router = useRouter();
  const isEdit = !!questionId;

  const [text, setText] = useState("");
  const [type, setType] = useState("yes_no");
  const [weight, setWeight] = useState(1);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  async function loadQuestion() {
    const res = await fetch("/api/admin/questions/" + questionId);
    if (res.ok) {
      const data = await res.json();
      setText(data.text);
      setType(data.type);
      setWeight(data.weight);
      if (data.options) {
        setOptions(Array.isArray(data.options) ? data.options : []);
      }
    }
    setLoading(false);
  }

  function addOption() {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setNewOption("");
    }
  }

  function removeOption(index: number) {
    setOptions(options.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: Record<string, unknown> = {
      text,
      type,
      weight,
    };

    if (type === "single_choice" || type === "multiple_choice") {
      payload.options = options;
    } else {
      payload.options = null;
    }

    const url = isEdit
      ? "/api/admin/questions/" + questionId
      : "/api/admin/questions";

    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur");
      setSubmitting(false);
      return;
    }

    router.push("/admin/questions");
  }

  const showOptions = type === "single_choice" || type === "multiple_choice";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        {/* Text */}
        <div>
          <label htmlFor="text" className="mb-1.5 block text-sm font-medium">
            Question
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={3}
            placeholder="Ex: Aidez-vous r\u00e9guli\u00e8rement un proche en situation de d\u00e9pendance ?"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="mb-1.5 block text-sm font-medium">
            Type de question
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="yes_no">Oui / Non</option>
            <option value="scale">\u00c9chelle 1-5</option>
            <option value="single_choice">Choix unique</option>
            <option value="multiple_choice">Choix multiple</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="weight" className="mb-1.5 block text-sm font-medium">
            Poids (scoring)
          </label>
          <input
            id="weight"
            type="number"
            min={1}
            max={10}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-32 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Plus le poids est \u00e9lev\u00e9, plus cette question influence le score final
          </p>
        </div>

        {/* Options (for choice types) */}
        {showOptions && (
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Options de r\u00e9ponse
            </label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm">
                    {opt}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="text-red-500 hover:text-red-700 text-sm px-2"
                  >
                    \u2715
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                  placeholder="Ajouter une option..."
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={addOption}
                  className="rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-[100px] border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting || !text}
          className="rounded-[100px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? "Enregistrement..." : isEdit ? "Enregistrer" : "Cr\u00e9er la question"}
        </button>
      </div>
    </form>
  );
}
