"use client";

import { useState } from "react";

interface ProfessionalAboutSectionProps {
  description: string;
}

export function ProfessionalAboutSection({ description }: ProfessionalAboutSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const truncated = description.length > 100;
  const shown = expanded || !truncated ? description : description.slice(0, 100) + "…";

  return (
    <div className="bg-white rounded-[20px] border border-line shadow-1 p-5">
      <h2 className="text-base font-black text-ink mb-3">À propos</h2>
      <p className="text-sm text-ink-2 leading-relaxed">{shown}</p>
      {truncated && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-bold text-tornoo-green"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
}
