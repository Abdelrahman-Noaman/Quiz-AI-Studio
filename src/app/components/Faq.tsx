"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Will QuizAI write questions without my course context?",
    a: "No. QuizAI starts from the materials you upload — your lecture notes, syllabus, and outcomes. It maps your content before it drafts a single question, so every item reflects what you actually teach.",
  },
  {
    q: "Can I control difficulty and cognitive demand?",
    a: "Yes. Set a target difficulty and a Bloom's-style cognitive mix across recall, apply, and analyze. QuizAI calibrates the whole set to match the way you want students to think.",
  },
  {
    q: "Where can I use the assessments I make?",
    a: "Export to LMS-ready formats, push to Google Forms, or generate a formatted answer key. Build once and deploy wherever your students are.",
  },
  {
    q: "Is QuizAI a replacement for educator judgment?",
    a: "It's a thinking partner, not an autopilot. QuizAI gives you a thoughtful first draft to push against — you review the reasoning, tune the distractors, and publish only what earns a place.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-t border-line">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-line">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-[13px] text-ink transition-colors hover:text-rust"
            >
              <span>
                <span className="text-muted">
                  {String(i + 1).padStart(2, "0")} /{" "}
                </span>
                {item.q}
              </span>
              <span
                className={`shrink-0 text-muted transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
              }`}
            >
              <p className="overflow-hidden pr-10 text-[12px] leading-relaxed text-ink-soft">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
