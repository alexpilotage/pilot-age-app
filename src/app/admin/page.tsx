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
    &lt;div className="space-y-6"&gt;
      &lt;div className="flex items-center justify-between"&gt;
        &lt;h1 className="text-2xl font-bold"&gt;Dashboard Admin&lt;/h1&gt;
        &lt;div className="flex gap-2"&gt;
          &lt;Link
            href="/admin/sessions/new"
            className="inline-flex items-center gap-2 rounded-[100px] border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          &gt;
            + Nouvelle session
          &lt;/Link&gt;
          &lt;Link
            href="/admin/companies/new"
            className="inline-flex items-center gap-2 rounded-[100px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          &gt;
            + Nouvelle entreprise
          &lt;/Link&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"&gt;
        &lt;Link
          href="/admin/companies"
          className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
        &gt;
          &lt;div className="flex items-center justify-between"&gt;
            &lt;p className="text-sm font-medium text-muted-foreground"&gt;
              Entreprises
            &lt;/p&gt;
            &lt;Building2 className="h-5 w-5 text-muted-foreground" /&gt;
          &lt;/div&gt;
          &lt;p className="mt-2 text-3xl font-bold"&gt;{companyCount ?? 0}&lt;/p&gt;
          &lt;p className="mt-1 text-xs text-muted-foreground"&gt;
            Clients enregistr&eacute;s
          &lt;/p&gt;
        &lt;/Link&gt;
        &lt;div className="rounded-xl border border-border bg-card p-6"&gt;
          &lt;div className="flex items-center justify-between"&gt;
            &lt;p className="text-sm font-medium text-muted-foreground"&gt;
              Utilisateurs
            &lt;/p&gt;
            &lt;Users className="h-5 w-5 text-muted-foreground" /&gt;
          &lt;/div&gt;
          &lt;p className="mt-2 text-3xl font-bold"&gt;{userCount ?? 0}&lt;/p&gt;
          &lt;p className="mt-1 text-xs text-muted-foreground"&gt;
            Comptes cr&eacute;&eacute;s
          &lt;/p&gt;
        &lt;/div&gt;
        &lt;Link
          href="/admin/sessions"
          className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
        &gt;
          &lt;div className="flex items-center justify-between"&gt;
            &lt;p className="text-sm font-medium text-muted-foreground"&gt;
              Sessions
            &lt;/p&gt;
            &lt;ClipboardList className="h-5 w-5 text-muted-foreground" /&gt;
          &lt;/div&gt;
          &lt;p className="mt-2 text-3xl font-bold"&gt;
            {sessionCount ?? 0}
          &lt;/p&gt;
          &lt;p className="mt-1 text-xs text-muted-foreground"&gt;
            Total r&eacute;alis&eacute;es
          &lt;/p&gt;
        &lt;/Link&gt;
        &lt;div className="rounded-xl border border-border bg-card p-6"&gt;
          &lt;div className="flex items-center justify-between"&gt;
            &lt;p className="text-sm font-medium text-muted-foreground"&gt;
              R&eacute;pondants
            &lt;/p&gt;
            &lt;TrendingUp className="h-5 w-5 text-muted-foreground" /&gt;
          &lt;/div&gt;
          &lt;p className="mt-2 text-3xl font-bold"&gt;
            {responseCount ?? 0}
          &lt;/p&gt;
          &lt;p className="mt-1 text-xs text-muted-foreground"&gt;
            Total questionnaires
          &lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      {/* Recent sessions */}
      &lt;div className="rounded-xl border border-border bg-card p-6"&gt;
        &lt;div className="mb-4 flex items-center justify-between"&gt;
          &lt;h3 className="text-sm font-semibold"&gt;
            Sessions r&eacute;centes
          &lt;/h3&gt;
          &lt;Link
            href="/admin/sessions"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          &gt;
            Voir tout &lt;ArrowRight className="h-3 w-3" /&gt;
          &lt;/Link&gt;
        &lt;/div&gt;
        {!recentSessions || recentSessions.length === 0 ? (
          &lt;p className="text-sm text-muted-foreground"&gt;
            Aucune session cr&eacute;&eacute;e pour le moment.
          &lt;/p&gt;
        ) : (
          &lt;div className="space-y-2"&gt;
            {recentSessions.map((s) =&gt; {
              const orgData = s.organizations as unknown as { name: string } | null;
              const orgName = orgData?.name || "\u2014";
              const isActive = s.status === "active";
              return (
                &lt;Link
                  key={s.id}
                  href={"/admin/sessions/" + s.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
                &gt;
                  &lt;div className="flex items-center gap-3"&gt;
                    &lt;div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"&gt;
                      &lt;ClipboardList className="h-4 w-4 text-primary-foreground" /&gt;
                    &lt;/div&gt;
                    &lt;div&gt;
                      &lt;p className="text-sm font-medium font-mono tracking-wider"&gt;{s.code}&lt;/p&gt;
                      &lt;p className="text-xs text-muted-foreground"&gt;{orgName}&lt;/p&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                  &lt;div className="flex items-center gap-3"&gt;
                    &lt;span className="text-xs text-muted-foreground"&gt;
                      {s.participant_count} r&eacute;ponse(s)
                    &lt;/span&gt;
                    &lt;span
                      className={
                        "rounded-full px-2.5 py-0.5 text-xs font-medium " +
                        (isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600")
                      }
                    &gt;
                      {isActive ? "Active" : "Termin\u00e9e"}
                    &lt;/span&gt;
                  &lt;/div&gt;
                &lt;/Link&gt;
              );
            })}
          &lt;/div&gt;
        )}
      &lt;/div&gt;

      {/* Recent companies */}
      &lt;div className="rounded-xl border border-border bg-card p-6"&gt;
        &lt;div className="mb-4 flex items-center justify-between"&gt;
          &lt;h3 className="text-sm font-semibold"&gt;
            Entreprises r&eacute;centes
          &lt;/h3&gt;
          &lt;Link
            href="/admin/companies"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          &gt;
            Voir tout &lt;ArrowRight className="h-3 w-3" /&gt;
          &lt;/Link&gt;
        &lt;/div&gt;
        {!recentCompanies || recentCompanies.length === 0 ? (
          &lt;p className="text-sm text-muted-foreground"&gt;
            Aucune entreprise enregistr&eacute;e pour le moment.
          &lt;/p&gt;
        ) : (
          &lt;div className="space-y-2"&gt;
            {recentCompanies.map((c) =&gt; {
              const statusClass = c.subscription_status === "active"
                ? "bg-green-100 text-green-700"
                : c.subscription_status === "trial"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700";
              const statusLabel = c.subscription_status === "trial"
                ? "Essai"
                : c.subscription_status === "active"
                  ? "Actif"
                  : "Expir\u00e9";
              return (
                &lt;Link
                  key={c.id}
                  href={"/admin/companies/" + c.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
                &gt;
                  &lt;div className="flex items-center gap-3"&gt;
                    &lt;div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"&gt;
                      &lt;Building2 className="h-4 w-4 text-primary-foreground" /&gt;
                    &lt;/div&gt;
                    &lt;div&gt;
                      &lt;p className="text-sm font-medium"&gt;{c.name}&lt;/p&gt;
                      &lt;p className="text-xs text-muted-foreground"&gt;
                        /{c.slug}
                      &lt;/p&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                  &lt;span
                    className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + statusClass}
                  &gt;
                    {statusLabel}
                  &lt;/span&gt;
                &lt;/Link&gt;
              );
            })}
          &lt;/div&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
