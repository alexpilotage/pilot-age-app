"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  User,
  Calendar,
  Users,
  ClipboardList,
  Pencil,
  Trash2,
  Loader2,
  QrCode,
} from "lucide-react";
import type { Organization, QuestionnaireSession, Profile } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  trial: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  trial: "Essai",
  active: "Actif",
  expired: "Expir\u00e9",
};

const SESSION_STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  active: "Active",
  closed: "Termin\u00e9e",
};

const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=";

interface CompanyDetailProps {
  company: Organization & {
    sessions: QuestionnaireSession[];
    users: Profile[];
  };
}

export function CompanyDetail({ company }: CompanyDetailProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.pilot-age.fr";
  const questionnaireUrl = appUrl + "/q/" + company.slug;
  const qrCodeUrl = QR_API_BASE + encodeURIComponent(questionnaireUrl);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/companies/" + company.id, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/companies");
        router.refresh();
      }
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux entreprises
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <span
                className={
                  "rounded-full px-2.5 py-0.5 text-xs font-medium " +
                  (STATUS_COLORS[company.subscription_status] || "")
                }
              >
                {STATUS_LABELS[company.subscription_status] ||
                  company.subscription_status}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              /{company.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={"/admin/companies/" + company.id + "/edit"}
            className="inline-flex items-center gap-1.5 rounded-[100px] border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-[100px] border border-error/30 px-4 py-2 text-sm font-medium text-error transition-colors hover:bg-error/5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Taille</span>
          </div>
          <p className="mt-2 text-lg font-bold">{company.size_range}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-xs font-medium">Contact</span>
          </div>
          <p className="mt-2 text-sm font-semibold">
            {company.contact_name}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="text-xs font-medium">Email</span>
          </div>
          <p className="mt-2 truncate text-sm font-semibold">
            {company.contact_email}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Inscription</span>
          </div>
          <p className="mt-2 text-sm font-semibold">
            {new Date(company.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      {/* QR Code + Link */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <QrCode className="h-4 w-4" />
          QR Code questionnaire
        </h2>
        <div className="flex items-start gap-6">
          <img
            src={qrCodeUrl}
            alt={"QR Code pour " + company.name}
            width={160}
            height={160}
            className="rounded-lg border border-border"
          />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Lien du questionnaire
              </p>
              <p className="mt-1 rounded-lg bg-muted px-3 py-2 font-mono text-sm break-all">
                {questionnaireUrl}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Partagez ce lien ou imprimez le QR code pour permettre aux
              salari&eacute;s d&rsquo;acc&eacute;der au questionnaire.
            </p>
            <a
              href={qrCodeUrl}
              download={"qrcode-" + company.slug + ".png"}
              className="inline-flex items-center gap-1.5 rounded-[100px] border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-muted"
            >
              T&eacute;l&eacute;charger le QR code
            </a>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="h-4 w-4" />
            Sessions questionnaire
          </h2>
          <span className="text-xs text-muted-foreground">
            {company.sessions.length} session
            {company.sessions.length !== 1 ? "s" : ""}
          </span>
        </div>
        {company.sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune session pour cette entreprise.
          </p>
        ) : (
          <div className="space-y-2">
            {company.sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    Code : {session.code}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.created_at).toLocaleDateString(
                      "fr-FR"
                    )}{" "}
                    &middot; {session.participant_count} participant
                    {session.participant_count !== 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={
                    "rounded-full px-2.5 py-0.5 text-xs font-medium " +
                    (session.status === "active"
                      ? "bg-green-100 text-green-700"
                      : session.status === "draft"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700")
                  }
                >
                  {SESSION_STATUS_LABELS[session.status] ||
                    session.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RH Users */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4" />
          Utilisateurs RH
        </h2>
        {company.users.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun utilisateur rattach&eacute;.
          </p>
        ) : (
          <div className="space-y-2">
            {company.users.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {u.first_name?.[0]}
                  {u.last_name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {u.first_name} {u.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {u.role === "admin_entreprise"
                      ? "Administrateur"
                      : u.role === "salarie"
                        ? "Salari\u00e9"
                        : u.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold">
              Supprimer cette entreprise ?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Cette action est irr&eacute;versible. Toutes les sessions et
              donn&eacute;es associ&eacute;es seront supprim&eacute;es.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-[100px] border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-[100px] bg-error px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-error/90 disabled:opacity-50"
              >
                {deleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
