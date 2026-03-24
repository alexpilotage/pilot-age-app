import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pilot-Âge | Plateforme salariés aidants",
    template: "%s | Pilot-Âge",
  },
  description:
    "Plateforme SaaS d'accompagnement des salariés aidants en entreprise. Diagnostic, formation, simulateurs et assistante sociale IA.",
  metadataBase: new URL("https://app.pilot-age.fr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn(playfair.variable, "font-sans", inter.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
