"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { PRICING_FAQ } from "@/data/pricingPlans";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-[#071A2A]">{q}</span>
        <CaretDown
          weight="bold"
          size={16}
          className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export function PricingFAQ() {
  return (
    <div className="mt-14">
      <h2 className="text-xl font-black text-[#071A2A] text-center mb-6">Questions fréquentes</h2>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
        {PRICING_FAQ.map((item) => (
          <FAQItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  );
}
