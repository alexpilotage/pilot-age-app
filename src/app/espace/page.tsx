import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  TrendingUp,
  CalendarDays,
  Mail,
  MessageCircle,
  BookOpen,
  Calculator,
  ArrowRight,
} from "lucide-react";

export default async function EspacePage() {
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

  const weekData = [
    { label: "Lun", value: 25 },
    { label: "Mar", value: 40 },
    { label: "Mer", value: 15 },
    { label: "Jeu", value: 55 },
    { label: "Ven", value: 30 },
    { label: "Sam", value: 10 },
    { label: "Dim", value: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <WelcomeHeader firstName={firstName} />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          title="Ma progression"
          value="68%"
          subtitle="8 / 15 modules complétés"
          icon={<TrendingUp className="h-5 w-5" />}
          accent
        />
        <KPICard
          title="Prochain événement"
          value="Mar 25"
          subtitle="Webinaire stress · Dans 5 jours"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <KPICard
          title="Messages Sophie"
          value="2"
          subtitle="non lus"
          icon={<Mail className="h-5 w-5" />}
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
            icon={<MessageCircle className="h-5 w-5" />}
            title="Parler à Sophie"
            subtitle="Assistante IA disponible"
            href="/espace/assistante"
            accent
          />
          <QuickAccessCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Reprendre la formation"
            subtitle="Droits aidants · 65%"
            href="/espace/formations"
          />
          <QuickAccessCard
            icon={<Calculator className="h-5 w-5" />}
            title="Simulateur de droits"
            subtitle="Calculer mes aides"
            href="/espace/outils"
          />
        </div>
      </div>

      {/* Formations en cours */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#181818]">
            Mes formations en cours
          </h3>
          <Link
            href="/espace/formations"
            className="text-xs font-medium text-[#FFCF02] hover:underline"
          >
            Tout voir
          </Link>
        </div>
        <div className="space-y-3">
          <FormationCard
            emoji="🌱"
            title="Comprendre l'aidance"
            category="Fondamentaux"
            duration="30 min"
            href="/espace/formations"
          />
          <FormationCard
            emoji="⚖️"
            title="Vos droits en tant qu'aidant"
            category="Droits & démarches"
            duration="45 min"
            progress={65}
            href="/espace/formations"
          />
          <FormationCard
            emoji="🧘"
            title="Gérer le stress et l'épuisement"
            category="Bien-être"
            duration="60 min"
            progress={20}
            href="/espace/formations"
          />
        </div>
      </div>

      {/* Agenda */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#181818]">Agenda</h3>
          <Link
            href="/espace/agenda"
            className="text-xs font-medium text-[#FFCF02] hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <div className="space-y-3">
          <AgendaItem
            title="Webinaire : Gérer l'épuisement"
            dayLabel="Mar"
            dayNumber="25"
            time="Mardi 25 mars · 18h00"
            typeBadge="En ligne"
            typeColor="bg-[#1E40AF]/10 text-[#1E40AF]"
          />
          <AgendaItem
            title="Session avec Sophie (IA)"
            dayLabel="Mer"
            dayNumber="26"
            time="Mercredi 26 mars · 14h30"
            typeBadge="IA"
            typeColor="bg-[#FFCF02]/20 text-[#181818]"
          />
          <AgendaItem
            title="Groupe de parole aidants"
            dayLabel="Ven"
            dayNumber="28"
            time="Vendredi 28 mars · 12h00"
            typeBadge="Présentiel"
            typeColor="bg-[#2D6A4F]/10 text-[#2D6A4F]"
          />
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
          Bienvenue sur votre espace aidants
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/70">
          Vous avez 2 nouveaux messages de Sophie et un webinaire prévu cette
          semaine.
        </p>
        <Link
          href="/espace/assistante"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FFCF02] px-5 py-2.5 text-sm font-semibold text-[#181818] transition-colors hover:bg-[#e6ba00]"
        >
          <MessageCircle className="h-4 w-4" />
          Parler à Sophie maintenant
        </Link>
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

function ActivityChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-[#E8E8E6] bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#181818]">
          Activité cette semaine
        </h3>
        <span className="text-xs font-semibold text-[#2D6A4F]">+18%</span>
      </div>
      <p className="mt-0.5 text-xs text-[#64748B]">
        Temps passé sur la plateforme (minutes)
      </p>
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

function FormationCard({
  emoji,
  title,
  category,
  duration,
  progress,
  href,
}: {
  emoji: string;
  title: string;
  category: string;
  duration: string;
  progress?: number;
  href: string;
}) {
  const buttonLabel =
    progress === undefined || progress === 0 ? "Revoir" : "Reprendre";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E8E8E6] bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F0EE] text-2xl">
        {emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#181818]">
          {title}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#64748B]">
          <span>{category}</span>
          <span>·</span>
          <span>{duration}</span>
          {progress !== undefined && progress > 0 && (
            <>
              <span>·</span>
              <span className="font-medium text-[#181818]">{progress}%</span>
            </>
          )}
        </div>
        {progress !== undefined && progress > 0 && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#F0F0EE]">
            <div
              className="h-full rounded-full bg-[#FFCF02] transition-all"
              role="progressbar"
              style={buildProgressStyle(progress)}
            />
          </div>
        )}
      </div>
      <Link
        href={href}
        className="shrink-0 rounded-lg border border-[#E8E8E6] px-3 py-1.5 text-xs font-medium text-[#181818] transition-colors hover:border-[#FFCF02] hover:bg-[#FFCF02]/5"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}

function buildProgressStyle(progress: number): React.CSSProperties {
  return { width: `${progress}%` };
}

function AgendaItem({
  title,
  dayLabel,
  dayNumber,
  time,
  typeBadge,
  typeColor,
}: {
  title: string;
  dayLabel: string;
  dayNumber: string;
  time: string;
  typeBadge: string;
  typeColor: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E8E8E6] bg-white p-4">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F0F0EE]">
        <span className="text-[10px] font-medium uppercase text-[#64748B]">
          {dayLabel}
        </span>
        <span className="text-sm font-bold text-[#181818]">{dayNumber}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#181818]">
          {title}
        </p>
        <p className="text-xs text-[#64748B]">{time}</p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${typeColor}`}
      >
        {typeBadge}
      </span>
    </div>
  );
}
