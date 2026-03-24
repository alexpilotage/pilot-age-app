"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SessionResponse {
  id: string;
  score: number;
  profile_type: string;
  created_at: string;
}

interface SessionData {
  id: string;
  code: string;
  status: string;
  participant_count: number;
  created_at: string;
  started_at: string;
  ended_at: string | null;
  organizations: { name: string; slug: string } | null;
  responses: SessionResponse[];
}

const PROFILE_LABELS: Record<string, string> = {
  aidant_probable: "Aidant probable",
  aidant_possible: "Aidant possible",
  non_aidant: "Non aidant",
};

const PROFILE_COLORS: Record<string, string> = {
  aidant_probable: "bg-red-100 text-red-700",
  aidant_possible: "bg-orange-100 text-orange-700",
  non_aidant: "bg-green-100 text-green-700",
};

export function SessionDetail({ id }: { id: string }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  async function fetchSession() {
    const res = await fetch("/api/admin/sessions/" + id);
    if (res.ok) {
      const data = await res.json();
      setSession(data);
    }
    setLoading(false);
  }

  async function toggleStatus() {
    if (!session) return;
    setActionLoading(true);
    const newStatus = session.status === "active" ? "completed" : "active";
    const res = await fetch("/api/admin/sessions/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      await fetchSession();
    }
    setActionLoading(false);
  }

  async function handleDelete() {
    setActionLoading(true);
    const res = await fetch("/api/admin/sessions/" + id, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/sessions");
    }
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Session non trouv\u00e9e</p>
      </div>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.pilot-age.fr";
  const questionnaireUrl = appUrl + "/q/" + session.code;
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(questionnaireUrl);
  const isActive = session.status === "active";
  const orgName = session.organizations?.name || "\u2014";

  // Stats
  const totalResponses = session.responses.length;
  const aidantProbable = session.responses.filter((r) => r.profile_type === "aidant_probable").length;
  const aidantPossible = session.responses.filter((r) => r.profile_type === "aidant_possible").length;
  const nonAidant = session.responses.filter((r) => r.profile_type === "non_aidant").length;
  const avgScore = totalResponses > 0
    ? Math.round(session.responses.reduce((sum, r) => sum + r.score, 0) / totalResponses)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/sessions"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            \u2190 Retour aux sessions
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            Session {session.code}
          </h1>
          <p className="text-sm text-muted-foreground">{orgName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleStatus}
            disabled={actionLoading}
            className={
              "rounded-[100px] px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 " +
              (isActive
                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                : "bg-green-100 text-green-700 hover:bg-green-200")
            }
          >
            {isActive ? "Cl\u00f4turer" : "R\u00e9ouvrir"}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-[100px] bg-red-100 px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-200"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* QR Code + Link */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">QR Code</h2>
          <img
            src={qrUrl}
            alt={"QR Code session " + session.code}
            className="mx-auto h-48 w-48 rounded-lg"
          />
          <p className="mt-4 font-mono text-2xl font-bold tracking-widest text-foreground">
            {session.code}
          </p>
          <p className="mt-2 text-xs text-muted-foreground break-all">
            {questionnaireUrl}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(questionnaireUrl)}
            className="mt-3 rounded-[100px] bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            Copier le lien
          </button>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">R\u00e9ponses</p>
              <p className="text-2xl font-bold text-foreground">{totalResponses}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Score moyen</p>
              <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Aidants probables</p>
              <p className="text-2xl font-bold text-red-600">{aidantProbable}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Aidants possibles</p>
              <p className="text-2xl font-bold text-orange-600">{aidantPossible}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Non aidants</p>
            <p className="text-2xl font-bold text-green-600">{nonAidant}</p>
          </div>
        </div>
      </div>

      {/* Responses table */}
      {totalResponses > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">R\u00e9ponses ({totalResponses})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Profil</th>
                </tr>
              </thead>
              <tbody>
                {session.responses.map((response) => {
                  const dateStr = new Date(response.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const profileLabel = PROFILE_LABELS[response.profile_type] || response.profile_type;
                  const profileColor = PROFILE_COLORS[response.profile_type] || "bg-gray-100 text-gray-600";

                  return (
                    <tr key={response.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-3 text-sm text-muted-foreground">{dateStr}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-foreground">{response.score}%</td>
                      <td className="px-6 py-3">
                        <span className={"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium " + profileColor}>
                          {profileLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">Supprimer cette session ?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Toutes les r\u00e9ponses associ\u00e9es seront supprim\u00e9es. Cette action est irr\u00e9versible.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-[100px] border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="rounded-[100px] bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
