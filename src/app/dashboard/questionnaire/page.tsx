"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, QrCode, Users, Calendar, ChevronRight, Radio } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Session {
  id: string;
  code: string;
  status: "draft" | "active" | "closed";
  created_at: string;
  started_at: string | null;
  closed_at: string | null;
  participant_count: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Brouillon", color: "bg-gray-100 text-gray-600" },
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  closed: { label: "Terminée", color: "bg-red-100 text-red-600" },
};

export default function QuestionnaireDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/questionnaire/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Realtime: listen for new responses across all sessions
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("all-questionnaire-responses")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "questionnaire_responses",
        },
        () => {
          // Refresh sessions to update participant counts
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);

  async function createSession() {
    setCreating(true);
    try {
      const res = await fetch("/api/questionnaire/sessions", {
        method: "POST",
      });
      if (res.ok) {
        await fetchSessions();
      }
    } finally {
      setCreating(false);
    }
  }

  const hasActiveSessions = sessions.some((s) => s.status === "active");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#181818] font-[family-name:var(--font-playfair)]">
              Questionnaires
            </h1>
            {hasActiveSessions && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                <Radio size={12} className="animate-pulse" />
                Temps réel actif
              </span>
            )}
          </div>
          <p className="text-[#6B6B6B] mt-1">
            Gérez vos sessions de questionnaire aidants
          </p>
        </div>
        <button
          onClick={createSession}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FFCF02] text-[#181818] font-semibold rounded-xl hover:bg-[#e6ba00] transition-all disabled:opacity-50"
        >
          <Plus size={18} />
          {creating ? "Création..." : "Nouvelle session"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-[#FFCF02] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E8E6]">
          <QrCode size={48} className="mx-auto text-[#E8E8E6] mb-4" />
          <h3 className="text-lg font-medium text-[#181818] mb-2">
            Aucune session
          </h3>
          <p className="text-[#6B6B6B] mb-6">
            Créez votre première session pour déployer le questionnaire
          </p>
          <button
            onClick={createSession}
            disabled={creating}
            className="px-6 py-3 bg-[#FFCF02] text-[#181818] font-semibold rounded-xl hover:bg-[#e6ba00] transition-all"
          >
            <Plus size={18} className="inline mr-2" />
            Créer une session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const status = STATUS_LABELS[session.status] || STATUS_LABELS.draft;
            return (
              <Link
                key={session.id}
                href={`/dashboard/questionnaire/${session.id}`}
                className="flex items-center justify-between p-5 bg-white rounded-xl border border-[#E8E8E6] hover:border-[#FFCF02] hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#F7F7F5] rounded-xl flex items-center justify-center">
                    <QrCode size={22} className="text-[#6B6B6B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-[#181818] text-lg tracking-wider">
                        {session.code}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                      {session.status === "active" && (
                        <Radio size={12} className="text-green-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#6B6B6B]">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {session.participant_count} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(session.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-[#E8E8E6] group-hover:text-[#FFCF02] transition-colors"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
