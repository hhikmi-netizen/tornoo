"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
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
    <div className="flex items-center gap-3 bg-surface-2 rounded-[14px] px-4 h-14 border border-line">
      <Icon size={19} className="text-ink-3 shrink-0" />
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
  const { lang, setLang } = useI18n();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);

  const isSignup = tab === "signup";
  const isValid = email.includes("@") && pw.length >= 4 && (!isSignup || name.trim().length > 1);

  return (
    <div className="relative bg-white overflow-y-auto min-h-svh">
      <CityBackdrop />

      <div className="relative z-10 px-6 pb-10 pt-safe-top">
        {/* Logo */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <TornooMark size={90} />
          <div className="text-center mt-4">
            <div className="font-black text-[46px] leading-none tracking-[-0.045em] text-ink">Tornoo</div>
            <div className="mt-1 font-bold text-[16px]">
              <span className="text-tornoo-green">L'attente</span>{" "}
              <span className="text-tornoo-orange">en temps réel</span>
            </div>
          </div>
        </div>

        {/* Welcome */}
        <div className="text-center mt-10">
          <h1 className="text-[30px] font-black text-ink">Bienvenue&nbsp;! 👋</h1>
          <p className="mt-2 text-ink-3 font-semibold text-sm max-w-[280px] mx-auto leading-relaxed whitespace-pre-line">
            {"Suivez votre attente et\nprenez votre tour à distance."}
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-3">
          {isSignup && (
            <InputField icon={User} value={name} onChange={setName} placeholder="Nom complet" />
          )}
          <InputField icon={Mail} type="email" value={email} onChange={setEmail} placeholder="Adresse e-mail" />
          <InputField
            icon={Lock}
            type={show ? "text" : "password"}
            value={pw}
            onChange={setPw}
            placeholder="Mot de passe"
            right={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="p-1"
              >
                {show ? (
                  <EyeOff size={20} className="text-ink-3" />
                ) : (
                  <Eye size={20} className="text-ink-3" />
                )}
              </button>
            }
          />
        </div>

        {!isSignup && (
          <div className="flex justify-end mt-3">
            <Link href="/forgot-password" className="text-sm font-bold text-tornoo-green">
              Mot de passe oublié ?
            </Link>
          </div>
        )}

        {/* Primary CTA */}
        <button
          className="mt-5 w-full h-14 rounded-[15px] font-extrabold text-white transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#07984a,#13b45b)" }}
          disabled={!isValid}
          onClick={() => {
            if (isSignup) {
              window.location.href = "/register";
            } else {
              window.location.href = "/home";
            }
          }}
        >
          {isSignup ? "Créer mon compte" : "Se connecter"}
        </button>

        {/* Separator */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs font-bold text-ink-3">ou</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Google */}
        <button type="button" className="w-full h-14 rounded-[15px] font-bold bg-white border border-line flex items-center justify-center gap-3 shadow-1">
          <GoogleG />
          <span className="text-sm">Continuer avec Google</span>
        </button>

        {/* Toggle signup/login */}
        <div className="flex flex-col items-center mt-6 gap-1.5">
          <span className="text-xs font-semibold text-ink-3">
            {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}
          </span>
          <button
            type="button"
            onClick={() => setTab(isSignup ? "login" : "signup")}
            className="font-extrabold text-[15px] text-tornoo-green"
          >
            {isSignup ? "Se connecter" : "Créer mon compte"}
          </button>
        </div>

        {/* Pro link */}
        <Link
          href="/pro"
          className="mt-4 w-full flex items-center justify-center h-11 rounded-[15px] bg-surface-2 border border-line text-sm font-bold text-ink-2"
        >
          Espace Pro · Inscription professionnelle
        </Link>

        {/* Language */}
        <div className="flex justify-center items-center gap-4 mt-5 pb-2">
          {LANGS.map(({ code, label }, i) => (
            <div key={code} className="flex items-center gap-4">
              {i > 0 && <span className="w-px h-4 bg-line" />}
              <button
                type="button"
                onClick={() => setLang(code)}
                className={`text-sm font-bold transition-colors ${
                  lang === code ? "text-ink" : "text-ink-3"
                }`}
              >
                {label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
