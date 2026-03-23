import { Users, ClipboardList, TrendingUp, BarChart3 } from "lucide-react";

/**
 * Dashboard Entreprise — Page principale
 * Affiche les statistiques anonymisées des questionnaires.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Participants"
          value="—"
          description="Total des répondants"
          icon={Users}
        />
        <StatsCard
          title="Aidants identifiés"
          value="—"
          description="% des répondants"
          icon={TrendingUp}
        />
        <StatsCard
          title="Sessions"
          value="—"
          description="Questionnaires réalisés"
          icon={ClipboardList}
        />
        <StatsCard
          title="Taux de participation"
          value="—"
          description="Répondants / effectif"
          icon={BarChart3}
        />
      </div>

      {/* Placeholder charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Répartition des profils
          </h3>
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Graphique disponible après la première session
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Évolution temporelle
          </h3>
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Comparaison disponible après 2 sessions
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
