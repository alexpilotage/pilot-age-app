"use client";

import { useState, use, useEffect } from "react";
import {
  ArrowLeft,
  QrCode,
  Users,
  Copy,
  Check,
  ExternalLink,
  XCircle,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import type { RealtimeStats } from "@/hooks/useRealtimeStats";

function buildQrUrl(pageUrl: string): string {
  const base = "https://api.qrserver.com/v1/create-qr-code/";
  const params = new URLSearchParams({ size: "300x300", data: pageUrl });
  return `${base}?${params.toString()}`;
}

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { session, stats, loading, newResponseCount, refresh } =
    useRealtimeStats(id);
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // Pulse animation when new response arrives
  useEffect(() => {
    if (newResponseCount > 0) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [newResponseCount]);

  async function closeSession() {
    setClosing(true);
    try {
      const res = await fetch(`/api/questionnaire/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      if (res.ok) {
        await refresh();
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
        <p className="text-[#6B6B6B]">Session non trouvée</p>
      </div>
    );
  }

  const questionnaireUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/q/${session.code}`
      : `/q/${session.code}`;

  const qrUrl = buildQrUrl(questionnaireUrl);

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/questionnaire"
        className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#181818] transition-colors"
      >
        <ArrowLeft size={18} />
        Retour aux sessions
      </Link>

      {/* Header with live indicator */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#181818] flex items-center gap-3 font-[family-name:var(--font-playfair)]">
              Session
              <span className="font-mono bg-[#F7F7F5] px-3 py-1 rounded-lg text-xl font-sans">
                {session.code}
              </span>
            </h1>
            {session.status === "active" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                <Radio size={12} className="animate-pulse" />
                En direct
              </span>
            )}
          </div>
          <p className="text-[#6B6B6B] mt-1">
            Créée le{" "}
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
            {closing ? "Fermeture..." : "Clôturer la session"}
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
            Imprimez ou partagez ce QR code avec vos salariés
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
              🔒 100% anonyme
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Aucune donnée personnelle n&apos;est collectée. Les réponses sont
              entièrement anonymes.
            </p>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-[#181818] font-[family-name:var(--font-playfair)]">
            Résultats
          </h2>
          {showPulse && (
            <span className="text-xs font-medium text-[#FFCF02] bg-[#FFCF02]/10 px-3 py-1 rounded-full animate-bounce">
              +1 nouvelle réponse !
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Participants"
            value={stats.total}
            icon={<Users size={20} />}
            highlight={showPulse}
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
              Répartition des profils
            </h3>
            <BarChart stats={stats} />
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
              Aucune réponse pour le moment. Partagez le QR code ou le lien
              avec vos salariés.
            </p>
            {session.status === "active" && (
              <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                <Radio size={12} className="animate-pulse" />
                Les résultats s&apos;afficheront en temps réel
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BarChart({ stats }: { stats: RealtimeStats }) {
  const items = [
    { key: "aidant_probable", count: stats.aidant_probable, color: "bg-[#FFCF02]", textColor: "text-[#181818]", label: "⬤ Aidant probable" },
    { key: "aidant_possible", count: stats.aidant_possible, color: "bg-orange-400", textColor: "text-white", label: "⬤ Aidant possible" },
    { key: "non_aidant", count: stats.non_aidant, color: "bg-green-500", textColor: "text-white", label: "⬤ Non aidant" },
  ];

  return (
    <>
      <div className="flex h-8 rounded-full overflow-hidden bg-[#F0F0EE] transition-all duration-500">
        {items.map((item) =>
          item.count > 0 ? (
            <div
              key={item.key}
              className={`${item.color} flex items-center justify-center text-xs font-bold ${item.textColor} transition-all duration-500`}
              style={getBarWidth(item.count, stats.total)}
            >
              {Math.round((item.count / stats.total) * 100)}%
            </div>
          ) : null
        )}
      </div>
      <div className="flex justify-between mt-3 text-xs text-[#6B6B6B]">
        {items.map((item) => (
          <span key={item.key}>{item.label}</span>
        ))}
      </div>
    </>
  );
}

function getBarWidth(count: number, total: number): React.CSSProperties {
  return { width: `${(count / total) * 100}%` };
}

function StatCard({
  label,
  value,
  icon,
  color,
  highlight,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
  highlight?: boolean;
}) {
  const borderClass = highlight
    ? "border-[#FFCF02] shadow-md shadow-[#FFCF02]/20"
    : "border-[#E8E8E6]";

  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-all duration-500 ${borderClass}`}
    >
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
