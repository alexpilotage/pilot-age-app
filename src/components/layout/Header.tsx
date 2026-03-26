"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/companies": "Entreprises",
  "/admin/sessions": "Sessions",
  "/admin/questions": "Questions",
  "/admin/formations": "Formations",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Paramètres",
  "/admin/aide": "Centre d'aide",
  "/dashboard": "Tableau de bord",
  "/dashboard/questionnaire": "Questionnaire",
  "/dashboard/rapports": "Rapports",
  "/dashboard/formations": "Formations",
  "/dashboard/settings": "Paramètres",
  "/dashboard/aide": "Centre d'aide",
  "/espace": "Accueil",
  "/espace/formations": "Formations",
  "/espace/outils": "Outils & Guides",
  "/espace/assistante": "Assistante IA",
  "/espace/profil": "Mon profil",
};

interface HeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Header({ isOpen, onToggle }: HeaderProps) {
  const pathname = usePathname();
  const title = BREADCRUMB_MAP[pathname] || "";

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E8E8E6] bg-white px-6">
      <div className="flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={onToggle}
            className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-[#F0F0EE] hover:text-[#181818]"
            title="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-[#181818]">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-[#F0F0EE] hover:text-[#181818]">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
