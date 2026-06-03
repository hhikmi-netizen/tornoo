"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, Plus, PencilSimple, Trash, X, Check, Phone, Camera, CalendarBlank } from "@phosphor-icons/react";
import { useToast } from "@/components/ui/Toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DaySlot { enabled: boolean; open: string; close: string }

interface Member {
  id: string;
  name: string;
  role: string;
  phone: string;
  active: boolean;
  photo?: string;
  schedule: DaySlot[];
}

type MemberForm = {
  name: string; role: string; phone: string;
  photo?: string;
  schedule: DaySlot[];
};

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAY_FULL   = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const DEFAULT_SCHEDULE: DaySlot[] = DAY_FULL.map((_, i) => ({
  enabled: i < 5,
  open: "09:00",
  close: "18:00",
}));

const EMPTY_FORM: MemberForm = { name: "", role: "", phone: "", schedule: DEFAULT_SCHEDULE };

const TIMES: string[] = [];
for (let h = 7; h <= 22; h++) for (const m of ["00", "30"]) TIMES.push(`${String(h).padStart(2, "0")}:${m}`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLORS = ["#07984a", "#2563eb", "#7c3aed", "#ff9300", "#ef2b24", "#0891b2"];

function colorFor(name: string): string {
  let s = 0; for (const c of name) s += c.charCodeAt(0);
  return COLORS[s % COLORS.length];
}

function initials(name: string): string {
  const p = name.trim().split(/\s+/);
  return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function workDaysSummary(schedule: DaySlot[]): string {
  const on = schedule.map((d, i) => d.enabled ? DAY_LABELS[i] : null).filter(Boolean);
  return on.length === 0 ? "Aucun jour" : on.join(" · ");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={value} onClick={onChange}
      className={`relative w-10 h-[22px] rounded-full transition-colors shrink-0 ${value ? "bg-tornoo-green" : "bg-[#d0d5dd]"}`}>
      <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${value ? "left-[20px]" : "left-0.5"}`} />
    </button>
  );
}

function PhotoPicker({ value, name, onChange }: { value?: string; name: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { alert("Photo trop volumineuse (max 4 Mo)"); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") onChange(reader.result); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [onChange]);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-black text-white shrink-0"
          style={{ background: value ? "transparent" : colorFor(name || "?") }}
        >
          {value
            ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <span>{name ? initials(name) : "?"}</span>}
        </div>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-tornoo-green border-2 border-white flex items-center justify-center"
          aria-label="Changer la photo"
        >
          <Camera weight="fill" size={13} className="text-white" />
        </button>
      </div>
      <button type="button" onClick={() => ref.current?.click()}
        className="text-xs font-bold text-tornoo-green">
        {value ? "Changer la photo" : "Ajouter une photo"}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

function AvailabilityEditor({ schedule, onChange }: { schedule: DaySlot[]; onChange: (s: DaySlot[]) => void }) {
  const setDay = (i: number, patch: Partial<DaySlot>) =>
    onChange(schedule.map((d, idx) => idx === i ? { ...d, ...patch } : d));

  return (
    <div>
      <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-3 block">Disponibilités</label>

      {/* Day toggle pills */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {DAY_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setDay(i, { enabled: !schedule[i].enabled })}
            className={`h-8 px-3 rounded-full text-xs font-black border transition-all ${
              schedule[i].enabled
                ? "bg-tornoo-green text-white border-tornoo-green"
                : "bg-surface-2 text-ink-3 border-line"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hours per active day */}
      <div className="space-y-2">
        {schedule.map((day, i) =>
          day.enabled ? (
            <div key={i} className="flex items-center gap-2 bg-surface-2 rounded-[12px] px-3 py-2 border border-line">
              <span className="text-xs font-black text-ink w-8 shrink-0">{DAY_LABELS[i]}</span>
              <select
                value={day.open}
                onChange={(e) => setDay(i, { open: e.target.value })}
                className="flex-1 bg-transparent text-xs font-bold text-ink outline-none appearance-none text-center"
              >
                {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className="text-xs text-ink-3 shrink-0">→</span>
              <select
                value={day.close}
                onChange={(e) => setDay(i, { close: e.target.value })}
                className="flex-1 bg-transparent text-xs font-bold text-ink outline-none appearance-none text-center"
              >
                {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

// ─── Member Sheet ─────────────────────────────────────────────────────────────

function MemberSheet({ initial, onSave, onClose }: {
  initial: MemberForm; onSave: (f: MemberForm) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<MemberForm>(initial);
  const valid = form.name.trim().length > 1 && form.role.trim().length > 0;
  const isEdit = !!initial.name;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg bg-white rounded-t-[28px] flex flex-col max-h-[92vh]"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-line shrink-0">
          <h2 className="text-xl font-black text-ink">
            {isEdit ? "Modifier le membre" : "Ajouter un membre"}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center">
            <X weight="bold" size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* Photo */}
          <PhotoPicker
            value={form.photo}
            name={form.name}
            onChange={(photo) => setForm((f) => ({ ...f, photo }))}
          />

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Nom complet</label>
            <input
              className="w-full h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors"
              placeholder="ex: Ahmed Benali"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block">Rôle / Poste</label>
            <input
              className="w-full h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors"
              placeholder="ex: Barber, Apprenti, Esthéticienne…"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </div>

          {/* Phone */}
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

          {/* Availability */}
          <AvailabilityEditor
            schedule={form.schedule}
            onChange={(schedule) => setForm((f) => ({ ...f, schedule }))}
          />
        </div>

        {/* Footer */}
        <div className="px-5 pt-3 pb-8 border-t border-line shrink-0">
          <button
            disabled={!valid}
            onClick={() => onSave(form)}
            className="w-full h-[52px] rounded-[14px] font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(135deg,#07984a,#13b45b)" }}
          >
            <Check weight="bold" size={18} />
            {isEdit ? "Enregistrer" : "Ajouter le membre"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Availability badge (compact summary on card) ─────────────────────────────

function AvailBadge({ schedule }: { schedule: DaySlot[] }) {
  const activeDays = schedule.filter((d) => d.enabled);
  if (activeDays.length === 0) return <span className="text-xs text-ink-4">Aucun jour planifié</span>;

  const firstOpen  = activeDays[0].open;
  const lastClose  = activeDays[activeDays.length - 1].close;
  const allSameHours = activeDays.every((d) => d.open === firstOpen && d.close === lastClose);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-1">
        {schedule.map((d, i) => (
          <span
            key={i}
            className={`w-6 h-6 rounded-full text-[9px] font-black flex items-center justify-center ${
              d.enabled ? "bg-tornoo-green text-white" : "bg-surface-2 text-ink-4"
            }`}
          >
            {DAY_LABELS[i][0]}
          </span>
        ))}
      </div>
      {allSameHours && (
        <span className="text-[10px] font-bold text-ink-3">{firstOpen} – {lastClose}</span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: Member[] = [
  { id: "m1", name: "Ahmed Benali", role: "Barber Chef", phone: "+212 6 11 22 33 44", active: true,  schedule: DEFAULT_SCHEDULE },
  { id: "m2", name: "Karim Alaoui", role: "Barber",      phone: "+212 6 55 66 77 88", active: true,  schedule: DEFAULT_SCHEDULE.map((d, i) => ({ ...d, enabled: i < 6 })) },
  { id: "m3", name: "Youssef Tahir", role: "Apprenti",   phone: "+212 6 99 00 11 22", active: false, schedule: DEFAULT_SCHEDULE.map((d, i) => ({ ...d, enabled: i >= 3 && i < 6 })) },
];

export default function ProTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [sheet, setSheet] = useState<{ mode: "add" | "edit"; member?: Member } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeCount = members.filter((m) => m.active).length;

  const handleSave = (form: MemberForm) => {
    if (sheet?.mode === "add") {
      const m: Member = {
        id: `m${Date.now()}`,
        name: form.name.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        active: true,
        photo: form.photo,
        schedule: form.schedule,
      };
      setMembers((prev) => [...prev, m]);
      toast(`${m.name} ajouté à l'équipe`, "success");
    } else if (sheet?.member) {
      setMembers((prev) => prev.map((m) =>
        m.id === sheet.member!.id
          ? { ...m, name: form.name.trim(), role: form.role.trim(), phone: form.phone.trim(), photo: form.photo, schedule: form.schedule }
          : m
      ));
      toast("Membre mis à jour", "success");
    }
    setSheet(null);
  };

  const handleDelete = (id: string) => {
    const m = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
    toast(`${m?.name} retiré de l'équipe`, "info");
  };

  const toggleActive = (id: string) => {
    const m = members.find((m) => m.id === id);
    setMembers((prev) => prev.map((mb) => mb.id === id ? { ...mb, active: !mb.active } : mb));
    if (m) toast(m.active ? `${m.name} désactivé` : `${m.name} activé`, "info");
  };

  return (
    <div className="bg-surface-2 min-h-svh">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
          <CaretLeft weight="bold" size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-ink">Équipe</h1>
          <p className="text-xs text-ink-3">{members.length} membre{members.length !== 1 ? "s" : ""} · {activeCount} actif{activeCount !== 1 ? "s" : ""}</p>
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
            <p className="text-sm text-ink-3 mt-1">Ajoutez les membres de votre équipe.</p>
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
              {/* Top row: avatar + info + actions */}
              <div className="flex items-start gap-3">
                {/* Avatar or photo */}
                <div className="relative shrink-0">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-base font-black text-white"
                    style={{ background: m.photo ? "transparent" : colorFor(m.name) }}
                  >
                    {m.photo
                      ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      : <span>{initials(m.name)}</span>}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${m.active ? "bg-tornoo-green" : "bg-[#d0d5dd]"}`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-ink">{m.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      m.active ? "bg-tornoo-green/10 text-tornoo-green" : "bg-surface-2 text-ink-3 border border-line"
                    }`}>
                      {m.active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-3 mt-0.5">{m.role}</p>
                  {m.phone && (
                    <p className="flex items-center gap-1 text-xs text-ink-3 mt-0.5">
                      <Phone weight="duotone" size={11} className="text-tornoo-green" />
                      {m.phone}
                    </p>
                  )}
                </div>

                {/* Action buttons or delete confirm */}
                {deleteId === m.id ? (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleDelete(m.id)} className="h-9 px-3 rounded-xl bg-[#ef2b24] text-white text-xs font-bold">Confirmer</button>
                    <button onClick={() => setDeleteId(null)} className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center border border-line">
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

              {/* Availability strip */}
              <div className="mt-3 pt-3 border-t border-line">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="flex items-center gap-1 text-[10px] font-bold text-ink-3 uppercase tracking-wide mb-1.5">
                      <CalendarBlank size={11} weight="bold" />
                      Disponibilités
                    </p>
                    <AvailBadge schedule={m.schedule} />
                  </div>
                  <Toggle value={m.active} onChange={() => toggleActive(m.id)} />
                </div>
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
                ? { name: sheet.member.name, role: sheet.member.role, phone: sheet.member.phone, photo: sheet.member.photo, schedule: sheet.member.schedule.map((d) => ({ ...d })) }
                : { ...EMPTY_FORM, schedule: DEFAULT_SCHEDULE.map((d) => ({ ...d })) }
            }
            onSave={handleSave}
            onClose={() => setSheet(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
