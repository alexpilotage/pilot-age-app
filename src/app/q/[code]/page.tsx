import { QuestionnaireClient } from "./questionnaire-client";

export default async function QuestionnairePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E8E6] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFCF02] rounded-lg flex items-center justify-center">
            <span className="font-black text-[#181818] text-sm">P</span>
          </div>
          <span className="text-lg font-bold text-[#181818] font-[family-name:var(--font-playfair)]">
            Pilot-Âge
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <QuestionnaireClient code={code} />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-[#6B6B6B]">
        <p>🔒 Vos réponses sont 100% anonymes et confidentielles</p>
      </footer>
    </div>
  );
}
