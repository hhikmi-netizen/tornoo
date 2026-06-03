"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, Plus, PencilSimple, Trash, X, Check, Phone } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";

interface Member {
  id: string;
  name: string;
  role: string;
  phone: string;
  active: boolean;
}

type MemberForm = { name: string; role: string; phone: string };
const EMPTY: MemberForm = { name: "", role: "", phone: "" };

const INITIAL_MEMBERS: Member[] = [
  { id: "m1", name: "Ahmed Benali", role: "Barber Chef", phone: "+212 6 11 22 33 44", active: true },
  { id: "m2", name: "Karim Alaoui", role: "Barber", phone: "+212 6 55 66 77 88", active: true },
  { id: "m3", name: "Youssef Tahir", role: "Apprenti", phone: "+212 6 99 00 11 22", active: false },
];

const AVATAR_COLORS = ["#07984a", "#2563eb", "#7c3aed", "#ff9300", "#ef2b24", "#0891b2"];

function colorFor(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? "bg-tornoo-green" : "bg-[#d0d5dd]"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function MemberSheet({
  initial,
  onSave,
  onClose,
}: {
  initial: MemberForm;
  onSave: (f: MemberForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<MemberForm>(initial);
  const valid = form.name.trim().length > 1 && form.role.trim().length > 0;

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
            {initial.name ? "Modifier le membre" : "Ajouter un membre"}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Fermer">
            <X weight="bold" size={16} />
          </button>
        </div>

        {/* Scrollable fields */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Nom complet</label>
            <input
              className="w-full h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors"
              placeholder="ex: Ahmed Benali"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Rôle</label>
            <input
              className="w-full h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors"
              placeholder="ex: Barber, Apprenti…"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Téléphone</label>
            <div className="relative">
              <Phone weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <input
                type="tel"
                className="w-full h-12 rounded-[12px] border border-line bg-surface-2 pl-8 pr-4 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors"
                placeholder="+212 6 00 00 00 00"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
          </div>
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
            {initial.name ? "Enregistrer" : "Ajouter le membre"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [sheet, setSheet] = useState<{ mode: "add" | "edit"; member?: Member } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeCount = members.filter((m) => m.active).length;

  const handleSave = (form: MemberForm) => {
    if (sheet?.mode === "add") {
      const newMember: Member = {
        id: `m${Date.now()}`,
        name: form.name.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        active: true,
      };
      setMembers((prev) => [...prev, newMember]);
      toast(`${newMember.name} ajouté à l'équipe`, "success");
    } else if (sheet?.member) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === sheet.member!.id
            ? { ...m, name: form.name.trim(), role: form.role.trim(), phone: form.phone.trim() }
            : m
        )
      );
      toast("Membre mis à jour", "success");
    }
    setSheet(null);
  };

  const handleDelete = (id: string) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
    toast(`${member?.name} retiré de l'équipe`, "info");
  };

  const toggleActive = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
    const member = members.find((m) => m.id === id);
    if (member) toast(member.active ? `${member.name} désactivé` : `${member.name} activé`, "info");
  };

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-ink">Équipe</h1>
          <p className="text-xs text-ink-3">
            {members.length} membre{members.length !== 1 ? "s" : ""} · {activeCount} actif{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setSheet({ mode: "add" })}
          className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-tornoo-green text-white text-sm font-bold active:scale-[0.97] transition-transform"
        >
          <Plus weight="bold" size={16} />
          Ajouter
        </button>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-3">
        {members.length === 0 && (
          <div className="text-center py-16">
            <p className="font-bold text-ink-2">Aucun membre</p>
            <p className="text-sm text-ink-3 mt-1">Ajoutez les membres de votre équipe pour les gérer ici.</p>
            <button onClick={() => setSheet({ mode: "add" })} className="mt-4 h-10 px-6 rounded-full bg-tornoo-green text-white text-sm font-bold">
              Ajouter un membre
            </button>
          </div>
        )}

        <AnimatePresence>
          {members.map((m, idx) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white rounded-[22px] border border-line shadow-1 p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-black text-white"
                  style={{ background: colorFor(m.name) }}
                >
                  {initials(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink truncate">{m.name}</p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        m.active
                          ? "bg-tornoo-green/10 text-tornoo-green"
                          : "bg-surface-2 text-ink-3 border border-line"
                      }`}
                    >
                      {m.active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-3 mt-0.5">{m.role}</p>
                  {m.phone && (
                    <p className="flex items-center gap-1 text-xs text-ink-3 mt-0.5">
                      <Phone weight="duotone" size={12} className="text-tornoo-green" />
                      {m.phone}
                    </p>
                  )}
                </div>

                {deleteId === m.id ? (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleDelete(m.id)} className="h-9 px-3 rounded-xl bg-[#ef2b24] text-white text-xs font-bold">
                      Confirmer
                    </button>
                    <button onClick={() => setDeleteId(null)} className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center border border-line" aria-label="Annuler">
                      <X weight="bold" size={14} className="text-ink-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setSheet({ mode: "edit", member: m })}
                      className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center border border-line active:scale-95 transition-transform"
                      aria-label="Modifier"
                    >
                      <PencilSimple weight="bold" size={15} className="text-ink-2" />
                    </button>
                    <button
                      onClick={() => setDeleteId(m.id)}
                      className="w-9 h-9 rounded-xl bg-[#fde7e6] flex items-center justify-center border border-[#f6c2bf] active:scale-95 transition-transform"
                      aria-label="Supprimer"
                    >
                      <Trash weight="bold" size={15} className="text-[#ef2b24]" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                <span className="text-xs font-bold text-ink-3">{m.active ? "Disponible en file" : "Hors file"}</span>
                <Toggle value={m.active} onChange={() => toggleActive(m.id)} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sheet && (
          <MemberSheet
            initial={
              sheet.mode === "edit" && sheet.member
                ? { name: sheet.member.name, role: sheet.member.role, phone: sheet.member.phone }
                : EMPTY
            }
            onSave={handleSave}
            onClose={() => setSheet(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
