"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#6B6B6B]">
          Question {current} sur {total}
        </span>
        <span className="text-sm font-medium text-[#181818]">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#E8E8E6] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#FFCF02] rounded-full"
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition= duration: 0.4, ease: "easeOut" 
        />
      </div>
    </div>
  );
}
