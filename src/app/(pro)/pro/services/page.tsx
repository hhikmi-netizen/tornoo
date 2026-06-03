"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, Plus, Clock, PencilSimple, Trash, X, Check, CurrencyDollar } from "@phosphor-icons/react";
import { MOCK_ESTABLISHMENTS } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import type { Service } from "@/types";

type ServiceForm = { name: string; durationMinutes: number; price: string; currency: string };
const EMPTY: ServiceForm = { name: "", durationMinutes: 30, price: "", currency: "DH" };

function ServiceModal({
  initial,
  onSave,
  onClose,
}: {
  initial: ServiceForm;
  onSave: (f: ServiceForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ServiceForm>(initial);
  const valid = form.name.trim().length > 1 && form.durationMinutes >= 5;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg bg-white rounded-t-[28px] flex flex-col max-h-[85vh]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
      >
        {/* Fixed header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-line shrink-0">
          <h2 className="text-xl font-black text-ink">
            {initial.name ? "Modifier le service" : "Nouveau service"}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center">
            <X weight="bold" size={16} />
          </button>
        </div>

        {/* Scrollable fields */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Nom du service</label>
            <input
              className="w-full h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors"
              placeholder="ex: Coupe homme, Massage relaxant…"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Durée (min)</label>
              <div className="relative">
                <Clock weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  type="number" min={5} max={480} step={5}
                  className="w-full h-12 rounded-[12px] border border-line bg-surface-2 pl-8 pr-3 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors"
                  value={form.durationMinutes}
                  onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Tarif (optionnel)</label>
              <div className="relative">
                <CurrencyDollar weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  type="number" min={0} placeholder="0"
                  className="w-full h-12 rounded-[12px] border border-line bg-surface-2 pl-8 pr-3 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {form.price && (
            <div className="flex gap-2">
              {["DH", "EUR", "USD"].map((c) => (
                <button
                  key={c}
                  onClick={() => setForm((f) => ({ ...f, currency: c }))}
                  className={`h-9 px-4 rounded-full text-xs font-bold border transition-all ${
                    form.currency === c ? "bg-tornoo-green text-white border-tornoo-green" : "bg-surface-2 text-ink-2 border-line"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fixed footer button */}
        <div className="px-5 pt-3 pb-8 border-t border-line shrink-0">
        <button
          disabled={!valid}
          onClick={() => onSave(form)}
          className="w-full h-[52px] rounded-[14px] font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all"
          style={{ background: "linear-gradient(135deg,#07984a,#13b45b)" }}
        >
          <Check weight="bold" size={18} />
          {initial.name ? "Enregistrer" : "Ajouter le service"}
        </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProServicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>(
    MOCK_ESTABLISHMENTS[0].services.map((s) => ({ ...s }))
  );
  const [modal, setModal] = useState<{ mode: "add" | "edit"; svc?: Service } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (form: ServiceForm) => {
    if (modal?.mode === "add") {
      const newSvc: Service = {
        id: `s${Date.now()}`,
        name: form.name.trim(),
        durationMinutes: form.durationMinutes,
        ...(form.price ? { price: Number(form.price), currency: form.currency } : {}),
      };
      setServices((prev) => [...prev, newSvc]);
      toast(`Service « ${newSvc.name} » ajouté`, "success");
    } else if (modal?.svc) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === modal.svc!.id
            ? { ...s, name: form.name.trim(), durationMinutes: form.durationMinutes, price: form.price ? Number(form.price) : undefined, currency: form.currency }
            : s
        )
      );
      toast("Service mis à jour", "success");
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    const svc = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
    toast(`Service « ${svc?.name} » supprimé`, "info");
  };

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-ink">Services</h1>
          <p className="text-xs text-ink-3">{services.length} service{services.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setModal({ mode: "add" })}
          className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-tornoo-green text-white text-sm font-bold active:scale-[0.97] transition-transform"
        >
          <Plus weight="bold" size={16} />
          Ajouter
        </button>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-3">
        {services.length === 0 && (
          <div className="text-center py-16">
            <Clock weight="duotone" size={40} className="mx-auto text-ink-4 mb-3" />
            <p className="font-bold text-ink-2">Aucun service configuré</p>
            <p className="text-sm text-ink-3 mt-1">Ajoutez vos prestations pour que les clients puissent réserver.</p>
            <button onClick={() => setModal({ mode: "add" })} className="mt-4 h-10 px-6 rounded-full bg-tornoo-green text-white text-sm font-bold">
              Créer un service
            </button>
          </div>
        )}

        <AnimatePresence>
          {services.map((s, idx) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center gap-3 bg-white rounded-[18px] px-4 py-4 border border-line shadow-1"
            >
              <div className="w-11 h-11 rounded-xl bg-low-bg flex items-center justify-center shrink-0">
                <Clock weight="duotone" size={20} className="text-tornoo-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink">{s.name}</p>
                <p className="text-xs text-ink-3 mt-0.5">
                  {s.durationMinutes} min{s.price ? ` · ${s.price} ${s.currency}` : ""}
                </p>
              </div>

              {deleteId === s.id ? (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleDelete(s.id)} className="h-9 px-3 rounded-xl bg-[#ef2b24] text-white text-xs font-bold">
                    Confirmer
                  </button>
                  <button onClick={() => setDeleteId(null)} className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center border border-line">
                    <X weight="bold" size={14} className="text-ink-3" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setModal({ mode: "edit", svc: s })}
                    className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center border border-line active:scale-95 transition-transform"
                    aria-label="Modifier"
                  >
                    <PencilSimple weight="bold" size={15} className="text-ink-2" />
                  </button>
                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="w-9 h-9 rounded-xl bg-[#fde7e6] flex items-center justify-center border border-[#f6c2bf] active:scale-95 transition-transform"
                    aria-label="Supprimer"
                  >
                    <Trash weight="bold" size={15} className="text-[#ef2b24]" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modal && (
          <ServiceModal
            initial={
              modal.mode === "edit" && modal.svc
                ? { name: modal.svc.name, durationMinutes: modal.svc.durationMinutes, price: modal.svc.price?.toString() ?? "", currency: modal.svc.currency ?? "DH" }
                : EMPTY
            }
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
