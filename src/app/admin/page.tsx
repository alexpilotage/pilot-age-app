import { Building2, Users, ClipboardList, TrendingUp } from "lucide-react";

/**
 * Admin Pilot-Âge — Dashboard global
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Entreprises</p>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">—</p>
          <p className="mt-1 text-xs text-muted-foreground">Clients actifs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">—</p>
          <p className="mt-1 text-xs text-muted-foreground">Comptes créés</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Sessions</p>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">—</p>
          <p className="mt-1 text-xs text-muted-foreground">Total réalisées</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Répondants</p>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">—</p>
          <p className="mt-1 text-xs text-muted-foreground">Total questionnaires</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold">Entreprises récentes</h3>
        <p className="text-sm text-muted-foreground">
          Aucune entreprise enregistrée pour le moment.
        </p>
      </div>
    </div>
  );
}
