import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Pilot-<span className="text-primary">Âge</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Plateforme d&apos;accompagnement des salariés aidants
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Se connecter
          </Link>
          <p className="text-sm text-muted-foreground">
            Vous avez un QR code ?{" "}
            <Link href="/q" className="font-medium text-primary underline">
              Accéder au questionnaire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
