"use client";

import { motion } from "framer-motion";

interface Question {
  id: string;
  text: string;
  type: "yes_no" | "scale" | "single_choice" | "multiple_choice";
  options: string[] | null;
}

interface QuestionCardProps {
  question: Question;
  answer: unknown;
  onAnswer: (value: unknown) => void;
  index: number;
}

export function QuestionCard({
  question,
  answer,
  onAnswer,
  index,
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial= opacity: 0, x: 40 
      animate= opacity: 1, x: 0 
      exit= opacity: 0, x: -40 
      transition= duration: 0.3 
      className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E8E6]"
    >
      <p className="text-lg font-medium text-[#181818] mb-8 leading-relaxed">
        <span className="text-[#FFCF02] font-bold mr-2">{index + 1}.</span>
        {question.text}
      </p>

      {question.type === "yes_no" && (
        <YesNoInput value={answer as string} onChange={onAnswer} />
      )}

      {question.type === "scale" && (
        <ScaleInput value={answer as number} onChange={onAnswer} />
      )}

      {question.type === "single_choice" && question.options && (
        <SingleChoiceInput
          options={
            typeof question.options === "string"
              ? JSON.parse(question.options)
              : question.options
          }
          value={answer as number}
          onChange={onAnswer}
        />
      )}
    </motion.div>
  );
}

function YesNoInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onChange("yes")}
        className={`flex-1 py-4 px-6 rounded-xl text-base font-medium transition-all ${
          value === "yes"
            ? "bg-[#FFCF02] text-[#181818] shadow-md"
            : "bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#E8E8E6]"
        }`}
      >
        Oui
      </button>
      <button
        type="button"
        onClick={() => onChange("no")}
        className={`flex-1 py-4 px-6 rounded-xl text-base font-medium transition-all ${
          value === "no"
            ? "bg-[#181818] text-white shadow-md"
            : "bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#E8E8E6]"
        }`}
      >
        Non
      </button>
    </div>
  );
}

function ScaleInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const labels = ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Énormément"];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 py-4 rounded-xl text-lg font-bold transition-all ${
              value === n
                ? "bg-[#FFCF02] text-[#181818] shadow-md scale-105"
                : "bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#E8E8E6]"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between px-1">
        <span className="text-xs text-[#6B6B6B]">{labels[0]}</span>
        <span className="text-xs text-[#6B6B6B]">{labels[4]}</span>
      </div>
    </div>
  );
}

function SingleChoiceInput({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((option, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onChange(idx)}
          className={`w-full text-left py-4 px-6 rounded-xl text-base transition-all ${
            value === idx
              ? "bg-[#FFCF02] text-[#181818] font-medium shadow-md"
              : "bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#E8E8E6]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
