"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Session {
  id: string;
  code: string;
  status: string;
  participant_count: number;
  created_at: string;
  started_at: string;
  ended_at: string | null;
  organizations: { name: string } | null;
}

export function SessionList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    const res = await fetch("/api/admin/sessions");
    if (res.ok) {
      const data = await res.json();
      setSessions(data);
    }
    setLoading(false);
  }

  const filtered = sessions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-[100px] px-4 py-1.5 text-sm font-medium transition-colors " +
              (filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80")
            }
          >
            {f === "all" ? "Toutes" : f === "active" ? "Actives" : "Terminées"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Aucune session trouvée
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Créez une session pour commencer à collecter des réponses
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((session) => {
            const orgName = session.organizations?.name || "—";
            const isActive = session.status === "active";
            const dateStr = new Date(session.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Link
                key={session.id}
                href={"/admin/sessions/" + session.id}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-lg font-bold tracking-wider text-foreground">
                    {session.code}
                  </span>
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                      (isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600")
                    }
                  >
                    {isActive ? "Active" : "Terminée"}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{orgName}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{dateStr}</span>
                  <span>{session.participant_count} réponse(s)</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
