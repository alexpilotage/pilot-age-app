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
}

export function Sidebar({ role, userName, organizationName }: SidebarProps) {
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
    <aside className="flex h-screen w-64 flex-col bg-[#181818] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="text-xl font-bold tracking-tight">
          pilot-<span className="text-[#FFCF02]">âge</span>
        </span>
        <span className="ml-1 text-[11px] text-white/40">Espace aidants</span>
      </div>

      {/* Organization badge */}
      {organizationName && (
        <div className="mx-4 mb-4 rounded-lg bg-white/5 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Entreprise
          </p>
          <p className="truncate text-sm font-medium">{organizationName}</p>
        </div>
      )}

      {/* Section-based navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pt-2">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {section.title}
            </p>
            <div className="space-y-1">
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
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#FFCF02] text-[#181818]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFCF02] px-1.5 text-[11px] font-bold text-[#181818]">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFCF02] text-sm font-bold text-[#181818]">
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {userName || "Utilisateur"}
            </p>
            <p className="truncate text-xs text-white/50">
              {roleLabels[role]}
            </p>
          </div>
          <button
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
