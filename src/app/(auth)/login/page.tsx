"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeSlash, Envelope, Lock, User, Buildings } from "@phosphor-icons/react";
import { TornooMark } from "@/components/tornoo/TornooLogo";
import { CityBackdrop } from "@/components/tornoo/CityBackdrop";
import { useI18n } from "@/i18n/context";
import type { Lang } from "@/types";

function GoogleG() {
  return (
    <svg width={22} height={22} viewBox="0 0 48 48" style={{ display: "block" }}>
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z"/>
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.4 46 24 46z"/>
      <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5C3 17.1 2.1 20.4 2.1 24s.9 6.9 2.4 10l7.3-5.7z"/>
      <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.4 2 8.1 6.9 4.5 14l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/>
    </svg>
  );
}

function InputField({
  icon: Icon, type = "text", value, onChange, placeholder, right,
}: {
  icon: React.ElementType; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-[16px] px-4 h-14 border border-[#e0e5ed] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all focus-within:border-[#07984a] focus-within:shadow-[0_0_0_3px_rgba(7,152,74,0.08)]">
      <Icon size={19} weight="duotone" className="text-ink-3 shrink-0" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-3"
      />
      {right}
    </div>
  );
}

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

export default function LoginPage() {
  const { lang, setLang, t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"client" | "pro">("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignup = tab === "signup";
  const isValid = email.includes("@") && pw.length >= 4 && (!isSignup || name.trim().length > 1);
  const destination = role === "pro" ? "/pro" : "/home";

  const saveSession = (userName?: string, userEmail?: string) => {
    localStorage.setItem("tornoo_auth", "1");
    localStorage.setItem("tornoo_role", role);
    if (userName) localStorage.setItem("tornoo_user", JSON.stringify({ name: userName, email: userEmail ?? "" }));
  };

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    saveSession(isSignup ? name : undefined, isSignup ? email : undefined);
    router.replace(destination);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    saveSession(
      role === "pro" ? "Ahmed Benali Pro" : "Amine Benali",
      role === "pro" ? "ahmed@barberclub.ma" : "amine@gmail.com"
    );
    router.replace(destination);
  };

  return (
    <div className="relative bg-white overflow-y-auto min-h-svh flex flex-col">
      <CityBackdrop />

      <div className="relative z-10 px-6 flex-1 flex flex-col pt-safe-top">
        {/* Logo centered */}
        <div className="flex flex-col items-center pt-10 pb-6">
          <TornooMark size={88} href="/" />
          <div className="font-black text-[38px] tracking-[-0.04em] text-[#0b1220] mt-3 leading-none">Tornoo</div>
          <div className="mt-1.5 text-sm font-bold">
            <span className="text-[#009B5A]">L'attente</span>{" "}
            <span className="text-[#8BC53F]">en</span>{" "}
            <span className="text-[#FF8A00]">temps</span>{" "}
            <span className="text-[#EF2B24]">réel</span>
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-center mb-6">
          <h1 className="text-[26px] font-black text-ink tracking-tight">
            {isSignup ? "Créer mon compte" : "Bienvenue !"}
          </h1>
          <p className="mt-1.5 text-ink-3 font-medium text-[14px] leading-relaxed max-w-[290px] mx-auto">
            {isSignup
              ? "Rejoignez Tornoo et gérez vos files en quelques minutes."
              : "Connectez-vous pour gérer vos files et suivre l'attente en temps réel."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="relative flex bg-surface-2 rounded-[14px] p-1 border border-line mb-5">
          {(["login", "signup"] as const).map((val) => (
            <button key={val} type="button" onClick={() => setTab(val)} className="relative flex-1 h-9 text-sm font-bold">
              {tab === val && (
                <motion.span layoutId="auth-tab"
                  className="absolute inset-0 rounded-[10px] bg-white border border-[#d0d5dd]"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${tab === val ? "text-ink font-extrabold" : "text-ink-3"}`}>
                {val === "login" ? "Se connecter" : "Créer un compte"}
              </span>
            </button>
          ))}
        </div>

        {/* Role selector — only on signup */}
        <AnimatePresence>
          {isSignup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "client", label: "Je suis client",  Icon: User,      desc: "Rejoindre une file" },
                  { id: "pro",    label: "Je suis pro",     Icon: Buildings, desc: "Gérer mon établissement" },
                ] as const).map(({ id, label, Icon, desc }) => (
                  <button key={id} type="button" onClick={() => setRole(id)}
                    className={`relative rounded-[14px] p-3 text-left transition-all border-2 ${
                      role === id ? "border-[#07984a] bg-[#f0faf4]" : "border-line bg-surface-2"
                    }`}>
                    <Icon size={20} weight="duotone" className={`block mb-1.5 ${role === id ? "text-[#07984a]" : "text-ink-3"}`} />
                    <p className={`text-xs font-extrabold ${role === id ? "text-[#07984a]" : "text-ink"}`}>{label}</p>
                    <p className="text-[10px] text-ink-3 mt-0.5 leading-tight">{desc}</p>
                    {role === id && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#07984a] flex items-center justify-center">
                        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="space-y-3">
          {isSignup && <InputField icon={User} value={name} onChange={setName} placeholder="Nom complet" />}
          <InputField icon={Envelope} type="email" value={email} onChange={setEmail} placeholder="Adresse e-mail" />
          <InputField
            icon={Lock} type={show ? "text" : "password"} value={pw} onChange={setPw} placeholder="Mot de passe"
            right={
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Masquer" : "Afficher"} className="p-1">
                {show ? <EyeSlash weight="regular" size={20} className="text-ink-3" /> : <Eye weight="regular" size={20} className="text-ink-3" />}
              </button>
            }
          />
        </div>

        {!isSignup && (
          <div className="flex justify-end mt-2.5">
            <Link href="/forgot-password" className="text-sm font-bold text-[#07984a]">Mot de passe oublié ?</Link>
          </div>
        )}

        {error && <p className="mt-2 text-sm text-[#ef2b24] font-medium text-center">{error}</p>}

        {/* Primary CTA */}
        <button
          className="mt-5 w-full h-[54px] rounded-[14px] font-extrabold text-white transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#07984a,#13b45b)", boxShadow: "0 4px 16px rgba(7,152,74,0.28)" }}
          disabled={!isValid || loading}
          onClick={handleSubmit}
        >
          {loading
            ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : (isSignup ? "Créer mon compte" : "Se connecter")}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-line" />
          <span className="text-[11px] font-extrabold text-ink-4 tracking-widest uppercase">ou</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Google */}
        <button type="button" disabled={googleLoading} onClick={handleGoogle}
          className="w-full h-[54px] rounded-[14px] font-bold bg-white border border-[#e0e5ed] flex items-center justify-center gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform disabled:opacity-60">
          {googleLoading
            ? <span className="w-5 h-5 rounded-full border-2 border-ink-3 border-t-transparent animate-spin" />
            : <GoogleG />}
          <span className="text-sm text-ink">{googleLoading ? "Connexion en cours…" : "Continuer avec Google"}</span>
        </button>

        {/* Create account link — only on login tab */}
        {!isSignup && (
          <div className="text-center mt-5 space-y-3">
            <div>
              <p className="text-sm text-ink-3">Vous n'avez pas de compte ?</p>
              <button
                onClick={() => setTab("signup")}
                className="mt-0.5 text-sm font-extrabold text-[#07984a] active:opacity-70"
              >
                Créer mon compte
              </button>
            </div>
            <div className="border-t border-line/50 pt-3">
              <p className="text-xs text-ink-4">Vous êtes un professionnel ?</p>
              <Link href="/pro-register" className="text-sm font-extrabold text-[#FF9300] active:opacity-70">
                Créer mon compte professionnel
              </Link>
            </div>
          </div>
        )}

        <div className="flex-1" />
      </div>

      {/* Language selector at bottom — matching mockup exactly */}
      <div className="relative z-10 flex items-center justify-center gap-5 py-6 border-t border-line/50">
        {LANGS.map(({ code, label }, i) => (
          <div key={code} className="flex items-center gap-5">
            {i > 0 && <span className="w-px h-4 bg-line" />}
            <button
              type="button"
              onClick={() => setLang(code)}
              className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${lang === code ? "text-ink" : "text-ink-4"}`}
            >
              {i === 0 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              )}
              {label}
              {i === 0 && lang === code && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
