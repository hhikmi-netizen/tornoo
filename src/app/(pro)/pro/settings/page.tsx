"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, Globe, Bell, Lock, SignOut, Trash, X, Eye, EyeSlash, DownloadSimple, CaretRight, WarningCircle, Lightning } from "@phosphor-icons/react";
import { useI18n } from "@/i18n/context";
import { useToast } from "@/components/ui/Toast";
import type { Lang } from "@/types";

interface StoredUser { name?: string; email?: string }

function SheetShell({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
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
        <button
          onClick={submit}
          className="w-full h-[52px] rounded-[14px] font-extrabold text-white active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg,#07984a,#13b45b)" }}
        >
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
          <input
            type={show ? "text" : "password"}
            className={inputCls + " pr-11"}
            value={next}
            onChange={(e) => { setNext(e.target.value); setError(""); }}
            placeholder="8 caractères minimum"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label={show ? "Masquer" : "Afficher"}>
            {show ? <EyeSlash size={18} className="text-ink-3" /> : <Eye size={18} className="text-ink-3" />}
          </button>
        </div>
      </div>
      <div>
        <label className={labelCls}>Confirmer le mot de passe</label>
        <input type={show ? "text" : "password"} className={inputCls} value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="Retapez le mot de passe" />
      </div>
      {error && <p className="text-sm text-[#ef2b24] font-medium">{error}</p>}
    </SheetShell>
  );
}

function DataSheet({
  user,
  onClose,
  onExport,
  onDelete,
}: {
  user: StoredUser;
  onClose: () => void;
  onExport: () => void;
  onDelete: () => void;
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

      <button
        onClick={onExport}
        className="w-full flex items-center justify-center gap-2 h-12 rounded-[14px] bg-surface-2 border border-line text-sm font-bold text-ink active:scale-[0.98] transition-transform"
      >
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
          <button
            onClick={() => setConfirming(true)}
            className="w-full h-12 rounded-[14px] bg-[#fde7e6] text-[#ef2b24] font-bold border border-[#f6c2bf] active:scale-[0.98] transition-transform"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-3 block">Tapez <span className="text-[#ef2b24] font-black">SUPPRIMER</span> pour confirmer</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full h-12 rounded-[12px] border border-line bg-white px-4 text-sm font-medium text-ink outline-none focus:border-[#ef2b24] transition-colors"
            />
            <button
              disabled={!canDelete}
              onClick={onDelete}
              className="w-full h-12 rounded-[14px] bg-[#ef2b24] text-white font-bold disabled:opacity-40 active:scale-[0.98] transition-transform"
            >
              Supprimer définitivement
            </button>
          </div>
        )}
      </div>
    </SheetShell>
  );
}

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? "bg-tornoo-green" : "bg-[#d0d5dd]"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

export default function ProSettingsPage() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const { toast } = useToast();
  const [notifQueue, setNotifQueue] = useState(true);
  const [notifClient, setNotifClient] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [sheet, setSheet] = useState<"password" | "data" | null>(null);
  const [user, setUser] = useState<StoredUser>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tornoo_user");
      if (stored) setUser(JSON.parse(stored) as StoredUser);
    } catch {}
  }, []);

  const doLogout = () => {
    localStorage.removeItem("tornoo_auth");
    localStorage.removeItem("tornoo_role");
    localStorage.removeItem("tornoo_user");
    router.replace("/login");
  };

  const deleteAccount = () => {
    toast("Compte supprimé", "info");
    localStorage.removeItem("tornoo_auth");
    localStorage.removeItem("tornoo_role");
    localStorage.removeItem("tornoo_user");
    setSheet(null);
    setTimeout(() => router.replace("/login"), 600);
  };

  const SECTIONS = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Alertes file d'attente", sub: "Quand un client rejoint ou quitte", value: notifQueue, onChange: setNotifQueue },
        { label: "Rappels clients", sub: "Notifier 15 min avant leur tour", value: notifClient, onChange: setNotifClient },
        { label: "Offres Tornoo", sub: "Actualités et promotions", value: notifPromo, onChange: setNotifPromo },
      ],
    },
  ];

  return (
    <div className="bg-surface-2 min-h-svh pb-28">
      {/* Header */}
      <div className="bg-white border-b border-line px-4 pt-safe-top pb-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center"
        >
          <CaretLeft weight="bold" size={18} className="text-ink" />
        </button>
        <h1 className="font-black text-lg text-ink flex-1">Paramètres</h1>
      </div>

      <div className="px-4 pt-4 space-y-4 max-w-lg mx-auto">
        {/* Notifications */}
        {SECTIONS.map(({ title, icon: Icon, items }) => (
          <motion.div key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-line flex items-center gap-2">
              <Icon weight="duotone" size={17} className="text-tornoo-green" />
              <h2 className="font-black text-sm text-ink">{title}</h2>
            </div>
            {items.map((item, i) => (
              <div key={item.label}
                className={`flex items-center gap-3 px-4 py-4 ${i < items.length - 1 ? "border-b border-line" : ""}`}>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{item.label}</p>
                  <p className="text-xs text-ink-3 mt-0.5">{item.sub}</p>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </motion.div>
        ))}

        {/* Subscription */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
          <Link href="/pro/subscription"
            className="flex items-center gap-3 bg-white rounded-[22px] border border-line shadow-1 px-4 py-4 active:bg-surface-2 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-low-bg flex items-center justify-center shrink-0">
              <Lightning weight="fill" size={18} className="text-tornoo-green" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-ink">Abonnement</p>
              <p className="text-xs text-ink-3 mt-0.5">Gérer votre forfait Tornoo Pro</p>
            </div>
            <CaretRight weight="bold" size={16} className="text-ink-4" />
          </Link>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-[22px] border border-line shadow-1 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe weight="duotone" size={17} className="text-tornoo-green" />
            <h2 className="font-bold text-sm text-ink">Langue</h2>
          </div>
          <div className="flex gap-2">
            {LANGS.map(({ code, label }) => (
              <button key={code} onClick={() => setLang(code)}
                className={`flex-1 h-10 rounded-[12px] text-sm font-bold transition-colors ${
                  lang === code ? "bg-tornoo-green text-white" : "bg-surface-2 text-ink-2 border border-line"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
          <div className="px-4 py-3 border-b border-line flex items-center gap-2">
            <Lock weight="duotone" size={17} className="text-ink-3" />
            <h2 className="font-black text-sm text-ink">Compte & sécurité</h2>
          </div>
          {[
            { label: "Modifier le mot de passe", sub: "Changer vos identifiants", onClick: () => setSheet("password") },
            { label: "Données personnelles", sub: "Télécharger ou supprimer", onClick: () => setSheet("data") },
          ].map((item, i, arr) => (
            <button key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left active:bg-surface-2 ${i < arr.length - 1 ? "border-b border-line" : ""}`}>
              <div className="flex-1">
                <p className="font-bold text-sm text-ink">{item.label}</p>
                <p className="text-xs text-ink-3 mt-0.5">{item.sub}</p>
              </div>
              <CaretRight weight="bold" size={16} className="text-ink-4" />
            </button>
          ))}
        </motion.div>

        {/* Danger zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="space-y-2">
          <button
            onClick={doLogout}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-[15px] bg-[#fde7e6] text-[#ef2b24] font-bold border border-[#f6c2bf] active:scale-[0.98] transition-transform"
          >
            <SignOut weight="bold" size={17} />
            Se déconnecter
          </button>
          <button
            onClick={() => setSheet("data")}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-[15px] text-[#ef2b24] font-medium text-sm active:opacity-70 transition-opacity"
          >
            <Trash weight="bold" size={14} />
            Supprimer mon compte
          </button>
        </motion.div>

        <p className="text-center text-xs text-ink-4 pb-2">Tornoo Pro · v1.0</p>
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
