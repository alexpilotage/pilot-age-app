"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ROLES = [
  {
    value: "super_admin",
    label: "Super Admin",
    emoji: "\ud83d\udd11",
    redirect: "/admin",
    description:
      "Acc\u00e8s complet \u2014 Gestion de toutes les entreprises et configurations globales.",
  },
  {
    value: "admin_entreprise",
    label: "Admin Entreprise",
    emoji: "\ud83c\udfe2",
    redirect: "/dashboard",
    description:
      "Dashboard entreprise \u2014 Gestion du questionnaire, sessions, rapports et statistiques.",
  },
  {
    value: "salarie",
    label: "Salari\u00e9 Aidant",
    emoji: "\ud83d\udc64",
    redirect: "/espace",
    description:
      "Espace aidant \u2014 Formations, assistant Sophie, simulateurs et outils personnalis\u00e9s.",
  },
];

export default function DevLoginPage() {
  const [selectedRole, setSelectedRole] = useState("admin_entreprise");
  const router = useRouter();

  const currentRole = ROLES.find((r) => r.value === selectedRole);

  function handleLogin() {
    document.cookie = "dev-role=" + selectedRole + "; path=/; max-age=86400";
    router.push(currentRole ? currentRole.redirect : "/dashboard");
  }

  if (process.env.NODE_ENV !== "development") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Page disponible uniquement en d\u00e9veloppement.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#181818] px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#181818]">
            Pilot-<span className="text-[#FFCF02]">\u00c2ge</span>
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Mode d\u00e9veloppement \u2014 S\u00e9lectionnez un r\u00f4le
          </p>
        </div>

        {/* Dev badge */}
        <div className="flex justify-center">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            \u26a0\ufe0f DEV ONLY
          </span>
        </div>

        {/* Role selector */}
        <div className="space-y-2">
          <label
            htmlFor="role-select"
            className="block text-sm font-medium text-[#181818]"
          >
            Choisir un profil utilisateur
          </label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#FFCF02]"
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.emoji} {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Role description */}
        {currentRole && (
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-[#64748B]">
            <p>{currentRole.description}</p>
          </div>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-[#FFCF02] px-4 py-3 text-sm font-bold text-[#181818] transition-colors hover:bg-[#e6ba00]"
        >
          {currentRole
            ? "Acc\u00e9der en tant que " + currentRole.emoji + " " + currentRole.label
            : "Acc\u00e9der"}
        </button>

        {/* Link to classic login */}
        <p className="text-center text-xs text-[#64748B]">
          <Link href="/login" className="underline hover:text-[#181818]">
            \u2190 Connexion classique
          </Link>
        </p>
      </div>
    </div>
  );
}
