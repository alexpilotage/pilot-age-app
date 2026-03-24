"use client";

import { useEffect, useState, use } from "react";
import {
  ArrowLeft,
  QrCode,
  Users,
  Copy,
  Check,
  ExternalLink,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface Session {
  id: string;
  code: string;
  status: "draft" | "active" | "closed";
  created_at: string;
  started_at: string | null;
  closed_at: string | null;
  participant_count: number;
}

interface Stats {
  total: number;
  aidant_probable: number;
  aidant_possible: number;
  non_aidant: number;
  average_score: number;
}

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [session, setSession] = useState<Session | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  async function fetchSession() {
    try {
      const res = await fetch(`/api/questionnaire/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
        setStats(data.stats);
      }
    } finally {
      setLoading(false);
    }
  }

  async function closeSession() {
    setClosing(true);
    try {
      const res = await fetch(`/api/questionnaire/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      if (res.ok) {
        await fetchSession();
      }
    } finally {
      setClosing(false);
    }
  }

  function copyLink() {
    if (!session) return;
    const url = `${window.location.origin}/q/${session.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-[#FFCF02] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!session || !stats) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6B6B6B]">Session non trouv\u00e9e</p>
      </div>
    );
  }

  const questionnaireUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/q/${session.code}`
      : `/q/${session.code}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(questionnaireUrl)}`;

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/dashboard/questionnaire"
        className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#181818] transition-colors"
      >
        <ArrowLeft size={18} />
        Retour aux sessions
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#181818] flex items-center gap-3"
            style= fontFamily: "var(--font-playfair)" 
          >
            Session
            <span className="font-mono bg-[#F7F7F5] px-3 py-1 rounded-lg text-xl">
              {session.code}
            </span>
          </h1>
          <p className="text-[#6B6B6B] mt-1">
            Cr\u00e9\u00e9e le{" "}
            {new Date(session.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {session.status === "active" && (
          <button
            onClick={closeSession}
            disabled={closing}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-all"
          >
            <XCircle size={18} />
            {closing ? "Fermeture..." : "Cl\u00f4turer la session"}
          </button>
        )}
      </div>

      {/* QR Code + Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8E8E6] p-8 text-center">
          <h3 className="font-semibold text-[#181818] mb-4 flex items-center justify-center gap-2">
            <QrCode size={20} />
            QR Code
          </h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`QR Code pour ${session.code}`}
            width={200}
            height={200}
            className="mx-auto rounded-xl"
          />
          <p className="text-sm text-[#6B6B6B] mt-4">
            Imprimez ou partagez ce QR code avec vos salari\u00e9s
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E8E6] p-8">
          <h3 className="font-semibold text-[#181818] mb-4 flex items-center gap-2">
            <ExternalLink size={20} />
            Lien de partage
          </h3>
          <div className="flex items-center gap-2 bg-[#F7F7F5] rounded-xl p-3">
            <code className="flex-1 text-sm text-[#181818] truncate">
              {questionnaireUrl}
            </code>
            <button
              onClick={copyLink}
              className="p-2 hover:bg-[#E8E8E6] rounded-lg transition-colors"
            >
              {copied ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Copy size={18} className="text-[#6B6B6B]" />
              )}
            </button>
          </div>
          <p className="text-sm text-[#6B6B6B] mt-4">
            Envoyez ce lien par email ou messagerie interne
          </p>

          <div className="mt-6 p-4 bg-[#FFCF02]/10 rounded-xl">
            <p className="text-sm font-medium text-[#181818]">
              \ud83d\udd12 100% anonyme
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Aucune donn\u00e9e personnelle n\u2019est collect\u00e9e. Les r\u00e9ponses sont
              enti\u00e8rement anonymes.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2
          className="text-xl font-bold text-[#181818] mb-4"
          style= fontFamily: "var(--font-playfair)" 
        >
          R\u00e9sultats
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Participants"
            value={stats.total}
            icon={<Users size={20} />}
          />
          <StatCard
            label="Aidants probables"
            value={stats.aidant_probable}
            color="text-[#FFCF02]"
          />
          <StatCard
            label="Aidants possibles"
            value={stats.aidant_possible}
            color="text-orange-500"
          />
          <StatCard
            label="Non aidants"
            value={stats.non_aidant}
            color="text-green-600"
          />
        </div>

        {stats.total > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-[#E8E8E6] p-6">
            <h3 className="font-semibold text-[#181818] mb-4">
              R\u00e9partition des profils
            </h3>
            <div className="flex h-8 rounded-full overflow-hidden bg-[#F0F0EE]">
              {stats.aidant_probable > 0 && (
                <div
                  className="bg-[#FFCF02] flex items-center justify-center text-xs font-bold text-[#181818]"
                  style={{
                    width: `${(stats.aidant_probable / stats.total) * 100}%`,
                  }}
                >
                  {Math.round((stats.aidant_probable / stats.total) * 100)}%
                </div>
              )}
              {stats.aidant_possible > 0 && (
                <div
                  className="bg-orange-400 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    width: `${(stats.aidant_possible / stats.total) * 100}%`,
                  }}
                >
                  {Math.round((stats.aidant_possible / stats.total) * 100)}%
                </div>
              )}
              {stats.non_aidant > 0 && (
                <div
                  className="bg-green-500 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    width: `${(stats.non_aidant / stats.total) * 100}%`,
                  }}
                >
                  {Math.round((stats.non_aidant / stats.total) * 100)}%
                </div>
              )}
            </div>
            <div className="flex justify-between mt-3 text-xs text-[#6B6B6B]">
              <span>\u2b24 Aidant probable</span>
              <span>\u2b24 Aidant possible</span>
              <span>\u2b24 Non aidant</span>
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-[#6B6B6B]">Score moyen</span>
              <p className="text-3xl font-bold text-[#181818]">
                {stats.average_score}
                <span className="text-lg text-[#6B6B6B]">/100</span>
              </p>
            </div>
          </div>
        )}

        {stats.total === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E8E6]">
            <Users size={40} className="mx-auto text-[#E8E8E6] mb-3" />
            <p className="text-[#6B6B6B]">
              Aucune r\u00e9ponse pour le moment. Partagez le QR code ou le lien
              avec vos salari\u00e9s.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E8E6] p-5">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-[#6B6B6B]">{icon}</span>}
        <span className="text-sm text-[#6B6B6B]">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${color || "text-[#181818]"}`}>
        {value}
      </p>
    </div>
  );
}
