"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Organization, SizeRange } from "@/types";

const SIZE_OPTIONS: { value: SizeRange; label: string }[] = [
  { value: "1-50", label: "1 à 50 salariés" },
  { value: "51-200", label: "51 à 200 salariés" },
  { value: "201-500", label: "201 à 500 salariés" },
  { value: "501-1000", label: "501 à 1 000 salariés" },
  { value: "1001+", label: "Plus de 1 000 salariés" },
];

interface CompanyFormProps {
  company?: Organization;
}

export function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter();
  const isEditing = !!company;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: company?.name || "",
    size_range: company?.size_range || ("1-50" as SizeRange),
    contact_email: company?.contact_email || "",
    contact_name: company?.contact_name || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/companies/${company.id}`
        : "/api/admin/companies";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      const data = await res.json();
      router.push(`/admin/companies/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur inattendue"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux entreprises
      </Link>

      <div>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Modifier l\u0027entreprise" : "Nouvelle entreprise"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEditing
            ? "Modifiez les informations de l\u0027entreprise"
            : "Enregistrez une nouvelle entreprise cliente"}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Nom de l&apos;entreprise{" "}
              <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Ex : Acme Corp"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Taille <span className="text-error">*</span>
            </label>
            <select
              required
              value={form.size_range}
              onChange={(e) =>
                setForm({
                  ...form,
                  size_range: e.target.value as SizeRange,
                })
              }
              className={inputClass}
            >
              {SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Nom du contact <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={form.contact_name}
              onChange={(e) =>
                setForm({ ...form, contact_name: e.target.value })
              }
              placeholder="Ex : Marie Dupont"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Email du contact <span className="text-error">*</span>
            </label>
            <input
              type="email"
              required
              value={form.contact_email}
              onChange={(e) =>
                setForm({ ...form, contact_email: e.target.value })
              }
              placeholder="Ex : marie@acme.com"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/companies"
            className="rounded-[100px] border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[100px] bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? "Enregistrer" : "Créer l\u0027entreprise"}
          </button>
        </div>
      </form>
    </div>
  );
}
