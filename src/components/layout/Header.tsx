"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/entreprises": "Entreprises",
  "/admin/questionnaire": "Questionnaire",
  "/admin/formations": "Formations",
  "/admin/analytics": "Analytics",
  "/dashboard": "Dashboard",
  "/dashboard/sessions": "Sessions",
  "/dashboard/sessions/new": "Nouvelle session",
  "/dashboard/rapports": "Rapports",
  "/dashboard/formations": "Formations",
  "/dashboard/settings": "Paramètres",
  "/espace": "Accueil",
  "/espace/formations": "Formations",
  "/espace/simulateurs": "Simulateurs",
  "/espace/assistante": "Assistante IA",
  "/espace/profil": "Mon profil",
};

export function Header() {
  const pathname = usePathname();
  const title = BREADCRUMB_MAP[pathname] || "";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
