"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Organization {
  id: string;
  name: string;
}

export function SessionForm() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrgs() {
      const res = await fetch("/api/admin/companies");
      if (res.ok) {
        const data = await res.json();
        setOrgs(data);
      }
      setLoading(false);
    }
    loadOrgs();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrg) return;

    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: selectedOrg }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur lors de la création");
      setSubmitting(false);
      return;
    }

    const session = await res.json();
    router.push("/admin/sessions/" + session.id);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <label htmlFor="org" className="mb-1.5 block text-sm font-medium">
            Entreprise
          </label>
          <select
            id="org"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sélectionnez une entreprise</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Un <strong>code unique</strong> sera généré automatiquement pour cette session.
            Vous pourrez le partager via QR code ou lien direct.
          </p>
        </div>

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
          disabled={submitting || !selectedOrg}
          className="rounded-[100px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? "Création..." : "Créer la session"}
        </button>
      </div>
    </form>
  );
}
