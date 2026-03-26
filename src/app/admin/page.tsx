import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Building2,
  Users,
  ClipboardList,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: companyCount },
    { count: userCount },
    { count: sessionCount },
    { count: responseCount },
  ] = await Promise.all([
    supabase
      .from("organizations")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("questionnaire_sessions")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("questionnaire_responses")
      .select("*", { count: "exact", head: true }),
  ]);

  const { data: recentCompanies } = await supabase
    .from("organizations")
    .select("id, name, slug, subscription_status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentSessions } = await supabase
    .from("questionnaire_sessions")
    .select("id, code, status, participant_count, created_at, organizations(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/sessions/new"
            className="inline-flex items-center gap-2 rounded-[100px] border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            + Nouvelle session
          </Link>
          <Link
            href="/admin/companies/new"
            className="inline-flex items-center gap-2 rounded-[100px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            + Nouvelle entreprise
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/companies"
          className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Entreprises
            </p>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">{companyCount ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Clients enregistrés
          </p>
        </Link>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Utilisateurs
            </p>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">{userCount ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Comptes créés
          </p>
        </div>
        <Link
          href="/admin/sessions"
          className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Sessions
            </p>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {sessionCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Total réalisées
          </p>
        </Link>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Répondants
            </p>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {responseCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Total questionnaires
          </p>
        </div>
      </div>

      {/* Recent sessions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Sessions récentes
          </h3>
          <Link
            href="/admin/sessions"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Voir tout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {!recentSessions || recentSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune session créée pour le moment.
          </p>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((s) => {
              const orgData = s.organizations as unknown as { name: string } | null;
              const orgName = orgData?.name || "—";
              const isActive = s.status === "active";
              return (
                <Link
                  key={s.id}
                  href={"/admin/sessions/" + s.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ClipboardList className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium font-mono tracking-wider">{s.code}</p>
                      <p className="text-xs text-muted-foreground">{orgName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {s.participant_count} réponse(s)
                    </span>
                    <span
                      className={
                        "rounded-full px-2.5 py-0.5 text-xs font-medium " +
                        (isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600")
                      }
                    >
                      {isActive ? "Active" : "Terminée"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent companies */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Entreprises récentes
          </h3>
          <Link
            href="/admin/companies"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Voir tout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {!recentCompanies || recentCompanies.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune entreprise enregistrée pour le moment.
          </p>
        ) : (
          <div className="space-y-2">
            {recentCompanies.map((c) => {
              const statusClass = c.subscription_status === "active"
                ? "bg-green-100 text-green-700"
                : c.subscription_status === "trial"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700";
              const statusLabel = c.subscription_status === "trial"
                ? "Essai"
                : c.subscription_status === "active"
                  ? "Actif"
                  : "Expiré";
              return (
                <Link
                  key={c.id}
                  href={"/admin/companies/" + c.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        /{c.slug}
                      </p>
                    </div>
                  </div>
                  <span
                    className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + statusClass}
                  >
                    {statusLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
