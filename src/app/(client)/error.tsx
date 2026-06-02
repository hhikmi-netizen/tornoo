"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function ClientError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-4 px-8 text-center">
      <AlertCircle size={48} className="text-high" />
      <h2 className="text-xl font-black text-ink">Une erreur est survenue</h2>
      <p className="text-sm text-ink-3">{error.message}</p>
      <button
        onClick={reset}
        className="h-12 px-6 rounded-[15px] bg-tornoo-green text-white font-extrabold text-sm"
      >
        Réessayer
      </button>
    </div>
  );
}
