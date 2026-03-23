"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { UserRole } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
  role: UserRole;
  userName?: string;
  organizationName?: string;
}

/**
 * Main application shell with sidebar + header.
 * Used by all authenticated layouts (admin, dashboard, espace).
 */
export function AppShell({
  children,
  role,
  userName,
  organizationName,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        role={role}
        userName={userName}
        organizationName={organizationName}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
