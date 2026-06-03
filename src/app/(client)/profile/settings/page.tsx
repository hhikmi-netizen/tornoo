"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, Bell, Globe, ShieldCheck, DeviceMobile, SignOut, Lock, X, Eye, EyeSlash, DownloadSimple, CaretRight, WarningCircle, Trash } from "@phosphor-icons/react";
import { useI18n } from "@/i18n/context";
import { useToast } from "@/components/ui/Toast";
import type { Lang } from "@/types";

interface StoredUser { name?: string; email?: string }

function SheetShell({
  title, onClose, children, footer,
}: {
  title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg bg-white rounded-t-[28px] flex flex-col max-h-[85vh]"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-line shrink-0">
          <h2 className="text-xl font-black text-ink">{title}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Fermer">
            <X weight="bold" size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">{children}</div>
        {footer && <div className="px-5 pt-3 pb-8 border-t border-line shrink-0">{footer}</div>}
      </motion.div>
    </motion.div>
  );
}

function PasswordSheet({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (next.length < 8) { setError("Le nouveau mot de passe doit faire au moins 8 caractères."); return; }
    if (next !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    onSaved();
  };

  const inputCls = "w-full h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-medium text-ink outline-none focus:border-tornoo-green focus:bg-white transition-colors";
  const labelCls = "text-xs font-bold text-ink-3 uppercase tracking-wide mb-1.5 block";

  return (
    <SheetShell
      title="Modifier le mot de passe"
      onClose={onClose}
      footer={
        <button onClick={submit}
          className="w-full h-[52px] rounded-[14px] font-extrabold text-white active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg,#07984a,#13b45b)" }}>
          Enregistrer
        </button>
      }
    >
      <div>
        <label className={labelCls}>Mot de passe actuel</label>
        <input type="password" className={inputCls} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" />
      </div>
      <div>
        <label className={labelCls}>Nouveau mot de passe</label>
        <div className="relative">
          <input type={show ? "text" : "password"} className={inputCls + " pr-11"} value={next}
            onChange={(e) => { setNext(e.target.value); setError(""); }} placeholder="8 caractères minimum" />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label={show ? "Masquer" : "Afficher"}>
            {show ? <EyeSlash size={18} className="text-ink-3" /> : <Eye size={18} className="text-ink-3" />}
          </button>
        </div>
      </div>
      <div>
        <label className={labelCls}>Confirmer le mot de passe</label>
        <input type={show ? "text" : "password"} className={inputCls} value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="Retapez le mot de passe" />
      </div>
      {error && <p className="text-sm text-[#ef2b24] font-medium">{error}</p>}
    </SheetShell>
  );
}

function DataSheet({
  user, onClose, onExport, onDelete,
}: {
  user: StoredUser; onClose: () => void; onExport: () => void; onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [text, setText] = useState("");
  const canDelete = text.trim().toUpperCase() === "SUPPRIMER";

  return (
    <SheetShell title="Données personnelles" onClose={onClose}>
      <div className="bg-surface-2 rounded-[16px] border border-line divide-y divide-line">
        <div className="flex justify-between px-4 py-3">
          <span className="text-xs font-bold text-ink-3">Nom</span>
          <span className="text-sm font-bold text-ink">{user.name || "—"}</span>
        </div>
        <div className="flex justify-between px-4 py-3">
          <span className="text-xs font-bold text-ink-3">Email</span>
          <span className="text-sm font-bold text-ink truncate max-w-[200px]">{user.email || "—"}</span>
        </div>
      </div>

      <button onClick={onExport}
        className="w-full flex items-center justify-center gap-2 h-12 rounded-[14px] bg-surface-2 border border-line text-sm font-bold text-ink active:scale-[0.98] transition-transform">
        <DownloadSimple weight="bold" size={17} className="text-tornoo-green" />
        Télécharger mes données
      </button>

      <div className="rounded-[16px] border border-[#f6c2bf] bg-[#fef4f3] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <WarningCircle weight="fill" size={17} className="text-[#ef2b24]" />
          <p className="font-black text-sm text-[#ef2b24]">Zone de danger</p>
        </div>
        <p className="text-xs text-ink-3">La suppression de votre compte est définitive et irréversible.</p>
        {!confirming ? (
          <button onClick={() => setConfirming(true)}
            className="w-full h-12 rounded-[14px] bg-[#fde7e6] text-[#ef2b24] font-bold border border-[#f6c2bf] active:scale-[0.98] transition-transform">
            Supprimer mon compte
          </button>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-3 block">Tapez <span className="text-[#ef2b24] font-black">SUPPRIMER</span> pour confirmer</label>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="SUPPRIMER"
              className="w-full h-12 rounded-[12px] border border-line bg-white px-4 text-sm font-medium text-ink outline-none focus:border-[#ef2b24] transition-colors" />
            <button disabled={!canDelete} onClick={onDelete}
              className="w-full h-12 rounded-[14px] bg-[#ef2b24] text-white font-bold disabled:opacity-40 active:scale-[0.98] transition-transform">
              Supprimer définitivement
            </button>
          </div>
        )}
      </div>
    </SheetShell>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors"
      style={{ background: value ? "#07984a" : "#c7cdd6" }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        animate={{ left: value ? "calc(100% - 20px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const { toast } = useToast();
  const [notifTurn, setNotifTurn] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [notifWhatsapp, setNotifWhatsapp] = useState(true);
  const [sheet, setSheet] = useState<"password" | "data" | null>(null);
  const [user, setUser] = useState<StoredUser>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tornoo_user");
      if (stored) setUser(JSON.parse(stored) as StoredUser);
    } catch {}
  }, []);

  const deleteAccount = () => {
    toast("Compte supprimé", "info");
    localStorage.removeItem("tornoo_auth");
    localStorage.removeItem("tornoo_user");
    setSheet(null);
    setTimeout(() => router.replace("/login"), 600);
  };

  const SETTINGS_GROUPS = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Mon tour approche", sub: "Alerte avant votre passage", value: notifTurn, onChange: setNotifTurn },
        { label: "Offres et promotions", sub: "Promos des établissements", value: notifPromo, onChange: setNotifPromo },
        { label: "WhatsApp", sub: "Rappels par WhatsApp", value: notifWhatsapp, onChange: setNotifWhatsapp },
      ],
    },
  ];

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 pt-safe-top pb-3 border-b border-line flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Retour">
          <CaretLeft weight="bold" size={20} />
        </button>
        <h1 className="text-xl font-black text-ink">Paramètres</h1>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-5">
        {/* Notifications */}
        {SETTINGS_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          return (
            <motion.section
              key={group.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2.5 mb-3 px-1">
                <div className="w-7 h-7 rounded-lg bg-[#fff1de] flex items-center justify-center">
                  <GroupIcon size={14} weight="duotone" className="text-[#ff9300]" />
                </div>
                <h2 className="text-sm font-black text-ink uppercase tracking-wide">{group.title}</h2>
              </div>
              <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
                {group.items.map((item, idx) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-4 py-3.5 ${idx < group.items.length - 1 ? "border-b border-line" : ""}`}
                  >
                    <div>
                      <p className="font-bold text-sm text-ink">{item.label}</p>
                      <p className="text-xs text-ink-3 mt-0.5">{item.sub}</p>
                    </div>
                    <Toggle value={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </motion.section>
          );
        })}

        {/* Language */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2.5 mb-3 px-1">
            <div className="w-7 h-7 rounded-lg bg-[#eff6ff] flex items-center justify-center">
              <Globe weight="duotone" size={14} className="text-[#2563eb]" />
            </div>
            <h2 className="text-sm font-black text-ink uppercase tracking-wide">Langue</h2>
          </div>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {LANGS.map(({ code, label, flag }, idx) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${idx < LANGS.length - 1 ? "border-b border-line" : ""} ${lang === code ? "bg-low-bg" : ""}`}
              >
                <span className="text-xl">{flag}</span>
                <span className={`flex-1 font-bold text-sm ${lang === code ? "text-tornoo-green" : "text-ink"}`}>{label}</span>
                {lang === code && (
                  <div className="w-5 h-5 rounded-full bg-tornoo-green flex items-center justify-center">
                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Account & security */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
          <div className="flex items-center gap-2.5 mb-3 px-1">
            <div className="w-7 h-7 rounded-lg bg-[#f0f2f4] flex items-center justify-center">
              <Lock weight="duotone" size={14} className="text-ink-2" />
            </div>
            <h2 className="text-sm font-black text-ink uppercase tracking-wide">Compte & sécurité</h2>
          </div>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {[
              { label: "Modifier le mot de passe", sub: "Changer vos identifiants", onClick: () => setSheet("password") },
              { label: "Données personnelles", sub: "Télécharger ou supprimer", onClick: () => setSheet("data") },
            ].map((item, idx, arr) => (
              <button key={item.label} onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-surface-2 transition-colors ${idx < arr.length - 1 ? "border-b border-line" : ""}`}>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{item.label}</p>
                  <p className="text-xs text-ink-3 mt-0.5">{item.sub}</p>
                </div>
                <CaretRight weight="bold" size={15} className="text-ink-4" />
              </button>
            ))}
          </div>
        </motion.section>

        {/* App info */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            {[
              { icon: ShieldCheck,  label: "Confidentialité",    color: "#07984a", bg: "#e4f6ec", onClick: () => toast("Politique de confidentialité disponible prochainement", "info") },
              { icon: DeviceMobile, label: "À propos de l'app", color: "#5b6472", bg: "#f0f2f4", onClick: () => toast("Tornoo v1.0.0 · Made with ❤️ in Morocco", "info") },
            ].map(({ icon: Icon, label, color, bg, onClick }, idx, arr) => (
              <button key={label} onClick={onClick}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-surface-2 transition-colors ${idx < arr.length - 1 ? "border-b border-line" : ""}`}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon size={16} weight="duotone" style={{ color }} />
                </div>
                <span className="flex-1 font-bold text-sm text-ink">{label}</span>
                <CaretRight weight="bold" size={15} className="text-ink-4" />
              </button>
            ))}
          </div>
        </motion.section>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            localStorage.removeItem("tornoo_auth");
            localStorage.removeItem("tornoo_user");
            router.replace("/login");
          }}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-[15px] bg-high-bg text-high font-bold border border-high-rim text-sm active:scale-[0.98] transition-transform"
        >
          <SignOut weight="bold" size={16} />
          Déconnexion
        </motion.button>

        <button
          onClick={() => setSheet("data")}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-[15px] text-[#ef2b24] font-medium text-sm active:opacity-70 transition-opacity"
        >
          <Trash weight="bold" size={14} />
          Supprimer mon compte
        </button>

        <p className="text-center text-xs text-ink-4">Tornoo v1.0.0 · Made with ❤️ in Morocco</p>
      </div>

      <AnimatePresence>
        {sheet === "password" && (
          <PasswordSheet
            onClose={() => setSheet(null)}
            onSaved={() => { setSheet(null); toast("Mot de passe mis à jour", "success"); }}
          />
        )}
        {sheet === "data" && (
          <DataSheet
            user={user}
            onClose={() => setSheet(null)}
            onExport={() => toast("Données envoyées par email", "success")}
            onDelete={deleteAccount}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
