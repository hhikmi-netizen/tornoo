"use client";

import { useRef } from "react";
import { Plus, X } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useToast } from "@/components/ui/Toast";
import type { ProfessionalPhoto } from "@/types/professional";

const MAX_PHOTOS = 8;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface PhotoUploaderProps {
  value: ProfessionalPhoto[];
  onChange: (v: ProfessionalPhoto[]) => void;
}

export function PhotoUploader({ value, onChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (file.size > MAX_SIZE_BYTES) {
      toast("Image trop grande (max 5 Mo)", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      onChange([...value, { id: Math.random().toString(36).slice(2), url }]);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const remove = (id: string) => {
    onChange(value.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {value.length < MAX_PHOTOS && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-[60px] h-[60px] rounded-[12px] border-2 border-dashed border-line bg-surface-2 flex flex-col items-center justify-center gap-0.5 text-ink-3 active:scale-95 transition-transform"
          aria-label="Ajouter une photo"
        >
          <Plus weight="bold" size={18} />
          <span className="text-[9px] font-bold">Ajouter</span>
        </button>
      )}

      {value.map((photo) => (
        <div key={photo.id} className="relative w-[60px] h-[60px] rounded-[12px] overflow-hidden shrink-0">
          <ImageWithFallback
            src={photo.url}
            alt={photo.alt ?? ""}
            width={60}
            height={60}
            className="w-full h-full object-cover"
            fallback={<div className="w-full h-full bg-line" />}
          />
          <button
            type="button"
            onClick={() => remove(photo.id)}
            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
            aria-label="Supprimer"
          >
            <X weight="bold" size={10} className="text-white" />
          </button>
        </div>
      ))}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
