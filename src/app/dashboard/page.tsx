import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  ClipboardList,
  BarChart3,
  PlusCircle,
  FileText,
  Download,
  ArrowRight,
  MessageCircle,
  CalendarDays,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user?.id ?? "")
    .single();

  const firstName = profile?.first_name || "there";

  const { count: totalSessions } = await supabase
    .from("questionnaire_sessions")
    .select("*", { count: "exact", head: true });

  const { count: activeSessions } = await supabase
    .from("questionnaire_sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: completedSessions } = await supabase
    .from("questionnaire_sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  const weekData = [
    { label: "Lun", value: 12 },
    { label: "Mar", value: 8 },
    { label: "Mer", value: 15 },
    { label: "Jeu", value: 22 },
    { label: "Ven", value: 18 },
    { label: "Sam", value: 3 },
    { label: "Dim", value: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <WelcomeHeader firstName={firstName} />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Sessions"
          value={String(totalSessions || 0)}
          subtitle="Campagnes de questionnaire"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <KPICard
          title="En cours"
          value={String(activeSessions || 0)}
          subtitle="Collecte de réponses active"
          icon={<BarChart3 className="h-5 w-5" />}
          accent
        />
        <KPICard
          title="Complétées"
          value={String(completedSessions || 0)}
          subtitle="Sessions terminées"
          icon={<Users className="h-5 w-5" />}
        />
        <KPICard
          title="Taux de participation"
          value="—"
          subtitle="En attente de données"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Activity chart + Quick access */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityChart data={weekData} />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#181818]">
            Accès rapide
          </h3>
          <QuickAccessCard
            icon={<PlusCircle className="h-5 w-5" />}
            title="Créer une session"
            subtitle="Lancer un nouveau questionnaire"
            href="/dashboard/questionnaire"
            accent
          />
          <QuickAccessCard
            icon={<FileText className="h-5 w-5" />}
            title="Voir les rapports"
            subtitle="Résultats anonymisés"
            href="/dashboard/rapports"
          />
          <QuickAccessCard
            icon={<Download className="h-5 w-5" />}
            title="Exporter les données"
            subtitle="PDF ou CSV"
            href="/dashboard/rapports"
          />
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#181818]">
            Sessions récentes
          </h3>
          <Link
            href="/dashboard/questionnaire"
            className="text-xs font-medium text-[#FFCF02] hover:underline"
          >
            Voir toutes les sessions
          </Link>
        </div>
        <div className="rounded-xl border border-[#E8E8E6] bg-white p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F0F0EE]">
              <ClipboardList className="h-6 w-6 text-[#64748B]" />
            </div>
            <p className="text-sm font-medium text-[#181818]">
              Aucune session pour le moment
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              Créez votre première campagne de questionnaire pour commencer.
            </p>
            <Link
              href="/dashboard/questionnaire"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FFCF02] px-5 py-2.5 text-sm font-semibold text-[#181818] transition-colors hover:bg-[#e6ba00]"
            >
              <PlusCircle className="h-4 w-4" />
              Créer une session
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Inline sub-components ---------- */

function WelcomeHeader({ firstName }: { firstName: string }) {
  const greeting = `Bonjour, ${firstName} 👋`;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#181818] p-8 text-white">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FFCF02]/10" />
      <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-[#FFCF02]/5" />
      <div className="relative">
        <p className="text-sm text-white/60">{greeting}</p>
        <h1 className="mt-2 text-2xl font-bold">
          Tableau de bord entreprise
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/70">
          Suivez les résultats anonymisés de vos campagnes de sensibilisation et
          identifiez les aidants au sein de votre organisation.
        </p>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  subtitle,
  icon,
  accent = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  const wrapperClass = accent
    ? "rounded-xl border border-[#FFCF02]/30 bg-[#FFCF02]/5 p-6 transition-shadow hover:shadow-md"
    : "rounded-xl border border-[#E8E8E6] bg-white p-6 transition-shadow hover:shadow-md";

  return (
    <div className={wrapperClass}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[#64748B]">{title}</p>
        <div className="text-[#64748B]">{icon}</div>
      </div>
      <p className="mt-2 text-3xl font-bold text-[#181818]">{value}</p>
      <p className="mt-1 text-xs text-[#64748B]">{subtitle}</p>
    </div>
  );
}

function ActivityChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-[#E8E8E6] bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#181818]">
          Participation cette semaine
        </h3>
        <span className="text-xs font-semibold text-[#2D6A4F]">+12%</span>
      </div>
      <div className="mt-6 flex items-end gap-2">
        {data.map((item) => {
          const heightPx = Math.max(8, (item.value / maxValue) * 120);
          const barStyle = buildBarStyle(heightPx);
          return (
            <div
              key={item.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="relative flex w-full justify-center">
                <div
                  className="w-8 rounded-t-md bg-[#FFCF02] transition-all hover:bg-[#e6ba00]"
                  style={barStyle}
                />
              </div>
              <span className="text-[11px] text-[#64748B]">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildBarStyle(heightPx: number): React.CSSProperties {
  return { height: `${heightPx}px` };
}

function QuickAccessCard({
  icon,
  title,
  subtitle,
  href,
  accent = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  accent?: boolean;
}) {
  const wrapperClass = accent
    ? "group flex items-center gap-4 rounded-xl border border-[#FFCF02] bg-[#FFCF02]/5 p-4 transition-all hover:shadow-md hover:bg-[#FFCF02]/10"
    : "group flex items-center gap-4 rounded-xl border border-[#E8E8E6] bg-white p-4 transition-all hover:shadow-md hover:border-[#FFCF02]/50";

  const iconWrapperClass = accent
    ? "flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFCF02] text-[#181818]"
    : "flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0F0EE] text-[#64748B]";

  return (
    <Link href={href} className={wrapperClass}>
      <div className={iconWrapperClass}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#181818]">{title}</p>
        <p className="text-xs text-[#64748B]">{subtitle}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-[#64748B] transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
