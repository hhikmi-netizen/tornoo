"use client";

import { useState } from "react";
import { Plus, X } from "@phosphor-icons/react";

interface ServiceTagsEditorProps {
  value: string[];
  onChange: (v: string[]) => void;
}

export function ServiceTagsEditor({ value, onChange }: ServiceTagsEditorProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInput("");
  };

  const remove = (service: string) => {
    if (value.length <= 1) return;
    onChange(value.filter((s) => s !== service));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((service) => (
          <div
            key={service}
            className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-tornoo-green/10 border border-tornoo-green/20"
          >
            <span className="text-sm font-semibold text-tornoo-green">{service}</span>
            {value.length > 1 && (
              <button
                type="button"
                onClick={() => remove(service)}
                className="text-tornoo-green/60 hover:text-tornoo-green transition-colors"
                aria-label={`Retirer ${service}`}
              >
                <X weight="bold" size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Ajouter un service..."
          className="flex-1 h-11 rounded-[12px] bg-surface-2 border border-line px-3 text-sm font-medium text-ink placeholder:text-ink-4 focus:outline-none focus:border-tornoo-green"
        />
        <button
          type="button"
          onClick={add}
          className="w-11 h-11 rounded-[12px] bg-tornoo-green flex items-center justify-center shrink-0"
          aria-label="Ajouter"
        >
          <Plus weight="bold" size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
