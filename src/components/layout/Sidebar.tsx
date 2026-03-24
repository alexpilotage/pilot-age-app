"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  FileText,
  GraduationCap,
  Settings,
  Building2,
  Users,
  Bot,
  Calculator,
  User,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  super_admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Entreprises", href: "/admin/entreprises", icon: Building2 },
    { label: "Questionnaire", href: "/admin/questionnaire", icon: ClipboardList },
    { label: "Formations", href: "/admin/formations", icon: GraduationCap },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ],
  admin_entreprise: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Questionnaire", href: "/dashboard/questionnaire", icon: ClipboardList },
    { label: "Rapports", href: "/dashboard/rapports", icon: FileText },
    { label: "Formations", href: "/dashboard/formations", icon: GraduationCap },
    { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ],
  salarie: [
    { label: "Accueil", href: "/espace", icon: LayoutDashboard },
    { label: "Formations", href: "/espace/formations", icon: GraduationCap },
    { label: "Simulateurs", href: "/espace/simulateurs", icon: Calculator },
    { label: "Assistante IA", href: "/espace/assistante", icon: Bot },
    { label: "Mon profil", href: "/espace/profil", icon: User },
  ],
};

interface SidebarProps {
  role: UserRole;
  userName?: string;
  organizationName?: string;
}

export function Sidebar({ role, userName, organizationName }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="text-xl font-bold">
          Pilot-<span className="text-sidebar-accent">Âge</span>
        </span>
      </div>

      {/* Organization */}
      {organizationName && (
        <div className="mx-4 mb-4 rounded-lg bg-white/10 px-3 py-2">
          <p className="text-xs text-white/60">Entreprise</p>
          <p className="truncate text-sm font-medium">{organizationName}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" &&
              item.href !== "/dashboard" &&
              item.href !== "/espace" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar bg-opacity-100"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-white/10 p-4">
        {userName && (
          <p className="mb-2 truncate text-sm text-white/70">{userName}</p>
        )}
        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
