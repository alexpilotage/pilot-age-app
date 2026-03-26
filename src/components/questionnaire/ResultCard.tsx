"use client";

import { motion } from "framer-motion";

interface ResultCardProps {
  score: number;
  profileType: "aidant_probable" | "aidant_possible" | "non_aidant";
}

const PROFILES = {
  aidant_probable: {
    title: "Vous êtes probablement aidant(e)",
    description:
      "Vos réponses suggèrent que vous jouez un rôle d'aidant significatif au quotidien. Des ressources et un accompagnement adapté peuvent vous aider.",
    icon: "❤️",
    color: "bg-[#FFCF02]",
    textColor: "text-[#181818]",
  },
  aidant_possible: {
    title: "Vous êtes peut-être aidant(e)",
    description:
      "Certaines de vos réponses indiquent que vous pourriez être en situation d'aidant. N'hésitez pas à vous renseigner sur les dispositifs disponibles.",
    icon: "🤔",
    color: "bg-[#F7F7F5]",
    textColor: "text-[#181818]",
  },
  non_aidant: {
    title: "Vous n'êtes pas identifié(e) comme aidant(e)",
    description:
      "D'après vos réponses, vous n'êtes pas en situation d'aidant actuellement. Sachez toutefois que ces situations peuvent évoluer.",
    icon: "✅",
    color: "bg-[#F0F0EE]",
    textColor: "text-[#181818]",
  },
};

const motionInitial = { opacity: 0, y: 30 };
const motionAnimate = { opacity: 1, y: 0 };
const motionTransition = { duration: 0.5 };

export function ResultCard({ score, profileType }: ResultCardProps) {
  const profile = PROFILES[profileType];

  return (
    <motion.div
      initial={motionInitial}
      animate={motionAnimate}
      transition={motionTransition}
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
            📚 Ressources utiles
          </h3>
          <ul className="space-y-2 text-sm text-[#6B6B6B]">
            <li>• Congé de proche aidant (jusqu'à 3 mois renouvelable)</li>
            <li>• Allocation journalière du proche aidant (AJPA)</li>
            <li>• Plateformes de répit dans votre département</li>
            <li>• Droit au répit pour les aidants</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
}
