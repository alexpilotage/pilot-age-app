"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import {
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  Settings,
  Bot,
  Wrench,
  HelpCircle,
  LogOut,
  BarChart3,
  FileText,
  Building2,
  MessageCircleQuestion,
  CalendarCheck,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: Record<UserRole, NavSection[]> = {
  super_admin: [
    {
      title: "Navigation",
      items: [
        { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
        { label: "Entreprises", href: "/admin/companies", icon: Building2 },
        { label: "Sessions", href: "/admin/sessions", icon: CalendarCheck },
        { label: "Questions", href: "/admin/questions", icon: MessageCircleQuestion },
        { label: "Formations", href: "/admin/formations", icon: GraduationCap },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Ressources",
      items: [
        { label: "Centre d'aide", href: "/admin/aide", icon: HelpCircle },
        { label: "Paramètres", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
  admin_entreprise: [
    {
      title: "Navigation",
      items: [
        { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
        { label: "Questionnaire", href: "/dashboard/questionnaire", icon: ClipboardList },
        { label: "Rapports", href: "/dashboard/rapports", icon: FileText },
        { label: "Formations", href: "/dashboard/formations", icon: GraduationCap },
      ],
    },
    {
      title: "Ressources",
      items: [
        { label: "Centre d'aide", href: "/dashboard/aide", icon: HelpCircle },
        { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ],
  salarie: [
    {
      title: "Navigation",
      items: [
        { label: "Tableau de bord", href: "/espace", icon: LayoutDashboard },
        { label: "Formation", href: "/espace/formations", icon: GraduationCap },
        { label: "Outils & Guides", href: "/espace/outils", icon: Wrench },
        { label: "Assistante IA", href: "/espace/assistante", icon: Bot, badge: 2 },
      ],
    },
    {
      title: "Ressources",
      items: [
        { label: "Centre d'aide", href: "/espace/aide", icon: HelpCircle },
        { label: "Paramètres", href: "/espace/profil", icon: Settings },
      ],
    },
  ],
};

interface SidebarProps {
  role: UserRole;
  userName?: string;
  organizationName?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ role, userName, organizationName, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const sections = NAV_SECTIONS[role];

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const roleLabels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin_entreprise: "Admin entreprise",
    salarie: "Salarié aidant",
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-white border-r border-[#E8E8E6] transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[72px]"
      )}
    >
      {/* Logo + Toggle */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className={cn("flex items-center gap-2 overflow-hidden", !isOpen && "justify-center w-full")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFCF02]">
            <span className="text-sm font-black text-[#181818]">P</span>
          </div>
          {isOpen && (
            <span className="text-base font-bold text-[#181818] whitespace-nowrap">
              pilot-<span className="text-[#FFCF02]">{âge}</span>
            </span>
          )}
        </div>
        {isOpen && (
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-[#6B6B6B] transition-colors hover:bg-[#F0F0EE] hover:text-[#181818]"
            title="Réduire le menu"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Organization badge */}
      {organizationName && isOpen && (
        <div className="mx-3 mb-3 rounded-xl bg-[#F7F7F5] px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-[#6B6B6B]">
            Entreprise
          </p>
          <p className="truncate text-sm font-semibold text-[#181818]">{organizationName}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pt-2">
        {sections.map((section) => (
          <div key={section.title}>
            {isOpen && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#6B6B6B]/60">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const basePaths = ["/admin", "/dashboard", "/espace"];
                const isExactBase = basePaths.includes(item.href);
                const isActive = isExactBase
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!isOpen ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isOpen ? "" : "justify-center",
                      isActive
                        ? "bg-[#FFCF02]/10 text-[#181818] font-semibold"
                        : "text-[#6B6B6B] hover:bg-[#F0F0EE] hover:text-[#181818]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-[#FFCF02]" : ""
                      )}
                    />
                    {isOpen && <span className="flex-1 whitespace-nowrap">{item.label}</span>}
                    {isOpen && item.badge ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFCF02] px-1.5 text-[11px] font-bold text-[#181818]">
                        {item.badge}
                      </span>
                    ) : null}
                    {!isOpen && isActive && (
                      <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#FFCF02]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Expand button (collapsed state) */}
      {!isOpen && (
        <div className="px-3 py-2">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-xl p-2.5 text-[#6B6B6B] transition-colors hover:bg-[#F0F0EE] hover:text-[#181818]"
            title="Déployer le menu"
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* User profile footer */}
      <div className="border-t border-[#E8E8E6] p-3">
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFCF02] text-sm font-bold text-[#181818]">
            {initials}
          </div>
          {isOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-[#181818]">
                {userName || "Utilisateur"}
              </p>
              <p className="truncate text-xs text-[#6B6B6B]">
                {roleLabels[role]}
              </p>
            </div>
          )}
          {isOpen && (
            <button
              className="rounded-lg p-1.5 text-[#6B6B6B] transition-colors hover:bg-[#F0F0EE] hover:text-[#181818]"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
