"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeSlash, Envelope, Lock, User } from "@phosphor-icons/react";
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
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  right,
}: {
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="input-ring flex items-center gap-3 bg-surface-2 rounded-[14px] px-4 h-14 border border-line transition-all">
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
  const [role, setRole] = useState<"client" | "pro">("client");
  const [tab, setTab] = useState<"login" | "signup">("login");
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
    <div className="relative bg-white overflow-y-auto min-h-svh">
      <CityBackdrop />

      <div className="relative z-10 px-6 pb-10 pt-safe-top">
        {/* Logo */}
        <div className="flex items-center justify-between pt-4">
          <TornooMark size={44} />
          <div className="flex items-center gap-3">
            {LANGS.map(({ code, label }, i) => (
              <div key={code} className="flex items-center gap-3">
                {i > 0 && <span className="w-px h-3 bg-line" />}
                <button type="button" onClick={() => setLang(code)}
                  className={`text-xs font-bold transition-colors ${lang === code ? "text-ink" : "text-ink-4"}`}>
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Welcome */}
        <div className="mt-10">
          <p className="section-eyebrow mb-2">Tornoo</p>
          <h1 className="text-[32px] font-black text-ink leading-tight tracking-[-0.02em]">{t.welcome}</h1>
          <p className="mt-2 text-ink-3 font-medium text-[15px] leading-relaxed max-w-[300px]">{t.authSub}</p>
        </div>

        {/* Role selector */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          {([
            { id: "client", label: "Je suis client", emoji: "👤", desc: "Rejoignez des files d'attente" },
            { id: "pro",    label: "Je suis pro",    emoji: "🏢", desc: "Gérez votre établissement" },
          ] as const).map(({ id, label, emoji, desc }) => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id)}
              className={`relative rounded-[16px] p-3.5 text-left transition-all border-2 ${
                role === id
                  ? "border-tornoo-green bg-low-bg shadow-[0_0_0_3px_rgba(7,152,74,.1)]"
                  : "border-line bg-surface-2"
              }`}
            >
              <span className="text-2xl block mb-1">{emoji}</span>
              <p className={`text-sm font-extrabold ${role === id ? "text-tornoo-green" : "text-ink"}`}>{label}</p>
              <p className="text-[11px] text-ink-3 mt-0.5 leading-tight">{desc}</p>
              {role === id && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-tornoo-green flex items-center justify-center">
                  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="relative flex bg-surface-2 rounded-[16px] p-1 mt-5 border border-line">
          {(["login", "signup"] as const).map((val) => (
            <button key={val} type="button" onClick={() => setTab(val)} className="relative flex-1 h-10 text-sm font-bold">
              {tab === val && (
                <motion.span layoutId="auth-tab"
                  className="absolute inset-0 rounded-[12px] bg-white border border-[#d0d5dd]"
                  style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${tab === val ? "text-ink font-extrabold" : "text-ink-3"}`}>
                {val === "login" ? t.loginTab : t.signupBtn}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="mt-4 space-y-3">
          {isSignup && <InputField icon={User} value={name} onChange={setName} placeholder={t.fullName} />}
          <InputField icon={Envelope} type="email" value={email} onChange={setEmail} placeholder={t.emailAddr} />
          <InputField
            icon={Lock}
            type={show ? "text" : "password"}
            value={pw} onChange={setPw} placeholder={t.passwordL}
            right={
              <button type="button" onClick={() => setShow((s) => !s)}
                aria-label={show ? "Masquer" : "Afficher"} className="p-1">
                {show ? <EyeSlash weight="regular" size={20} className="text-ink-3" /> : <Eye weight="regular" size={20} className="text-ink-3" />}
              </button>
            }
          />
        </div>

        {!isSignup && (
          <div className="flex justify-end mt-3">
            <Link href="/forgot-password" className="text-sm font-bold text-tornoo-green">{t.forgot}</Link>
          </div>
        )}

        {error && <p className="mt-2 text-sm text-[#ef2b24] font-medium text-center">{error}</p>}

        {/* Primary CTA */}
        <button
          className="mt-5 w-full h-14 rounded-[15px] font-extrabold text-white transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#07984a,#13b45b)" }}
          disabled={!isValid || loading}
          onClick={handleSubmit}
        >
          {loading
            ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : (isSignup ? t.signupBtn : t.loginBtn)}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-line" />
          <span className="text-[11px] font-extrabold text-ink-4 tracking-widest uppercase">ou</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Google */}
        <button type="button" disabled={googleLoading} onClick={handleGoogle}
          className="w-full h-14 rounded-[15px] font-bold bg-white border border-line flex items-center justify-center gap-3 shadow-1 active:scale-[0.98] transition-transform disabled:opacity-60">
          {googleLoading
            ? <span className="w-5 h-5 rounded-full border-2 border-ink-3 border-t-transparent animate-spin" />
            : <GoogleG />}
          <span className="text-sm">{googleLoading ? "Connexion en cours…" : t.continueGoogle}</span>
        </button>

        <div className="pb-2" />
      </div>
    </div>
  );
}
