"use client";

import { motion } from "framer-motion";

interface ResultCardProps {
  score: number;
  profileType: "aidant_probable" | "aidant_possible" | "non_aidant";
}

const PROFILES = {
  aidant_probable: {
    title: "Vous \u00eates probablement aidant(e)",
    description:
      "Vos r\u00e9ponses sugg\u00e8rent que vous jouez un r\u00f4le d\u2019aidant significatif au quotidien. Des ressources et un accompagnement adapt\u00e9 peuvent vous aider.",
    icon: "\u2764\ufe0f",
    color: "bg-[#FFCF02]",
    textColor: "text-[#181818]",
  },
  aidant_possible: {
    title: "Vous \u00eates peut-\u00eatre aidant(e)",
    description:
      "Certaines de vos r\u00e9ponses indiquent que vous pourriez \u00eatre en situation d\u2019aidant. N\u2019h\u00e9sitez pas \u00e0 vous renseigner sur les dispositifs disponibles.",
    icon: "\ud83e\udd14",
    color: "bg-[#F7F7F5]",
    textColor: "text-[#181818]",
  },
  non_aidant: {
    title: "Vous n\u2019\u00eates pas identifi\u00e9(e) comme aidant(e)",
    description:
      "D\u2019apr\u00e8s vos r\u00e9ponses, vous n\u2019\u00eates pas en situation d\u2019aidant actuellement. Sachez toutefois que ces situations peuvent \u00e9voluer.",
    icon: "\u2705",
    color: "bg-[#F0F0EE]",
    textColor: "text-[#181818]",
  },
};

export function ResultCard({ score, profileType }: ResultCardProps) {
  const profile = PROFILES[profileType];

  return (
    <motion.div
      initial= opacity: 0, y: 30 
      animate= opacity: 1, y: 0 
      transition= duration: 0.5 
      className={`rounded-2xl p-8 ${profile.color} border border-[#E8E8E6]`}
    >
      <div className="text-center">
        <span className="text-5xl mb-4 block">{profile.icon}</span>
        <h2
          className={`text-2xl font-bold mb-4 ${profile.textColor} font-[family-name:var(--font-playfair)]`}
        >
          {profile.title}
        </h2>
        <p className="text-[#6B6B6B] text-base leading-relaxed mb-6 max-w-md mx-auto">
          {profile.description}
        </p>

        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-6 py-3">
          <span className="text-sm text-[#6B6B6B]">Score</span>
          <span className="text-2xl font-bold text-[#181818]">{score}</span>
          <span className="text-sm text-[#6B6B6B]">/100</span>
        </div>
      </div>

      {profileType !== "non_aidant" && (
        <div className="mt-8 p-6 bg-white/60 backdrop-blur rounded-xl">
          <h3 className="font-semibold text-[#181818] mb-3">
            \ud83d\udcda Ressources utiles
          </h3>
          <ul className="space-y-2 text-sm text-[#6B6B6B]">
            <li>\u2022 Cong\u00e9 de proche aidant (jusqu\u2019\u00e0 3 mois renouvelable)</li>
            <li>\u2022 Allocation journali\u00e8re du proche aidant (AJPA)</li>
            <li>\u2022 Plateformes de r\u00e9pit dans votre d\u00e9partement</li>
            <li>\u2022 Droit au r\u00e9pit pour les aidants</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
}
