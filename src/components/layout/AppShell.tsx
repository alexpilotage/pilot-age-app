"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { UserRole } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
  role: UserRole;
  userName?: string;
  organizationName?: string;
}

export function AppShell({
  children,
  role,
  userName,
  organizationName,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F7F5]">
      <Sidebar
        role={role}
        userName={userName}
        organizationName={organizationName}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
