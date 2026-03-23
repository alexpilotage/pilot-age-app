import Link from "next/link";
import { GraduationCap, Calculator, Bot, ClipboardList } from "lucide-react";

/**
 * Espace Salarié — Dashboard personnel
 */
export default function EspacePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Bienvenue sur votre espace</h2>
        <p className="mt-1 text-muted-foreground">
          Retrouvez ici toutes les ressources pour vous accompagner au
          quotidien.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAccessCard
          title="Formations"
          description="Vidéos, guides et outils pratiques"
          href="/espace/formations"
          icon={GraduationCap}
        />
        <QuickAccessCard
          title="Simulateurs"
          description="APA, congé aidant, aides financières"
          href="/espace/simulateurs"
          icon={Calculator}
        />
        <QuickAccessCard
          title="Assistante IA"
          description="Posez vos questions 24h/24"
          href="/espace/assistante"
          icon={Bot}
        />
        <QuickAccessCard
          title="Mon questionnaire"
          description="Consultez vos résultats"
          href="/espace/profil"
          icon={ClipboardList}
        />
      </div>
    </div>
  );
}

function QuickAccessCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
    >
      <Icon className="mb-3 h-8 w-8 text-primary" />
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
