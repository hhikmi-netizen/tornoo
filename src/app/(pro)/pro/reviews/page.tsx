"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, Star, X, Check } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";

interface Review {
  id: string;
  name: string;
  bg: string;
  stars: number;
  date: string;
  body: string;
  reply?: string;
}

const INITIAL_REVIEWS: Review[] = [
  { id: "r1", name: "Sofia M.", bg: "#07984a", stars: 5, date: "Il y a 2 jours", body: "Service impeccable, aucune attente grâce à Tornoo. Je recommande vivement !" },
  { id: "r2", name: "Yassine K.", bg: "#2563eb", stars: 4, date: "Il y a 4 jours", body: "Très bon accueil, file gérée efficacement. Petit bémol sur le temps d'attente en fin de journée." },
  { id: "r3", name: "Amina R.", bg: "#7c3aed", stars: 5, date: "Il y a 1 semaine", body: "Parfait du début à la fin. L'application m'a prévenue pile au bon moment." },
  { id: "r4", name: "Omar B.", bg: "#ff9300", stars: 3, date: "Il y a 2 semaines", body: "Correct mais l'attente annoncée était sous-estimée. À améliorer.", reply: "Merci pour votre retour, nous ajustons nos estimations !" },
];

function StatBar({ stars, pct }: { stars: number; pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-ink-3 w-3">{stars}</span>
      <Star weight="fill" size={11} className="text-[#f7c400]" />
      <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div className="h-full rounded-full bg-[#f7c400]" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-ink-3 w-8 text-right">{pct}%</span>
    </div>
  );
}

function ReplySheet({ review, onClose, onSend }: { review: Review; onClose: () => void; onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg bg-white rounded-t-[28px] flex flex-col max-h-[85vh]"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-line shrink-0">
          <h2 className="text-xl font-black text-ink">Répondre à {review.name}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Fermer">
            <X weight="bold" size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="bg-surface-2 rounded-[14px] border border-line p-3">
            <p className="text-sm text-ink-2 leading-relaxed">{review.body}</p>
          </div>
          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Votre réponse</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Merci pour votre avis…"
              className="w-full rounded-[12px] border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors resize-none"
            />
          </div>
        </div>
        <div className="px-5 pt-3 pb-8 border-t border-line shrink-0">
          <button
            disabled={text.trim().length < 2}
            onClick={() => onSend(text.trim())}
            className="w-full h-[52px] rounded-[14px] font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(135deg,#07984a,#13b45b)" }}
          >
            <Check weight="bold" size={18} />
            Envoyer la réponse
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProReviewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [replyTo, setReplyTo] = useState<Review | null>(null);

  const avg = (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    pct: Math.round((reviews.filter((r) => r.stars === s).length / reviews.length) * 100),
  }));

  const handleSend = (text: string) => {
    if (!replyTo) return;
    setReviews((prev) => prev.map((r) => (r.id === replyTo.id ? { ...r, reply: text } : r)));
    setReplyTo(null);
    toast("Réponse envoyée", "success");
  };

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-ink">Avis clients</h1>
          <p className="text-xs text-ink-3">{reviews.length} avis</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5 flex items-center gap-5">
          <div className="text-center shrink-0">
            <p className="text-4xl font-black text-ink leading-none">{avg}</p>
            <div className="flex items-center justify-center gap-0.5 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} weight="fill" size={12} className={i < Math.round(Number(avg)) ? "text-[#f7c400]" : "text-line"} />
              ))}
            </div>
            <p className="text-[11px] text-ink-3 mt-1">{reviews.length} avis</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map((d) => <StatBar key={d.stars} stars={d.stars} pct={d.pct} />)}
          </div>
        </div>

        {/* Reviews */}
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[22px] border border-line shadow-1 p-4 space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-black text-white" style={{ background: review.bg }}>
                {review.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-ink">{review.name}</span>
                  <span className="text-xs text-ink-3">{review.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {Array.from({ length: review.stars }).map((_, si) => (
                    <Star key={si} weight="fill" size={12} className="text-[#f7c400]" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">{review.body}</p>

            {review.reply ? (
              <div className="bg-low-bg rounded-[14px] border border-low-rim p-3">
                <p className="text-[11px] font-black text-tornoo-green uppercase tracking-wide mb-1">Votre réponse</p>
                <p className="text-sm text-ink-2 leading-relaxed">{review.reply}</p>
              </div>
            ) : (
              <button
                onClick={() => setReplyTo(review)}
                className="h-8 px-4 rounded-full border border-tornoo-green text-tornoo-green text-xs font-bold transition-colors hover:bg-low-bg"
              >
                Répondre
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {replyTo && <ReplySheet review={replyTo} onClose={() => setReplyTo(null)} onSend={handleSend} />}
      </AnimatePresence>
    </div>
  );
}
