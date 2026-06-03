"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CaretLeft, User, Envelope, Lock, Eye, EyeSlash, Phone } from "@phosphor-icons/react";
import { TornooMark } from "@/components/tornoo/TornooLogo";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/i18n/context";

function Field({
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
      <Icon size={18} weight="duotone" className="text-ink-3 shrink-0" />
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

function GoogleG() {
  return (
    <svg width={20} height={20} viewBox="0 0 48 48" style={{ display: "block" }}>
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z"/>
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.4 46 24 46z"/>
      <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5C3 17.1 2.1 20.4 2.1 24s.9 6.9 2.4 10l7.3-5.7z"/>
      <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.4 2 8.1 6.9 4.5 14l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/>
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);

  const isValid = name.trim().length > 1 && email.includes("@") && pw.length >= 6;

  const handleSubmit = () => {
    toast(t.welcome, "success");
    setTimeout(() => router.replace("/home"), 800);
  };

  return (
    <div className="bg-white min-h-svh">
      <div className="px-5 pt-safe-top pb-10">
        {/* Header — compact, consistent with login */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-ink-2 font-bold"
          >
            <CaretLeft weight="bold" size={20} />
            <span className="text-sm">{t.back}</span>
          </button>
          <TornooMark size={36} />
        </div>

        {/* Heading */}
        <div className="mt-10">
          <p className="section-eyebrow mb-2">Tornoo</p>
          <h1 className="text-[30px] font-black text-ink leading-tight tracking-[-0.02em]">
            {t.createAccount}
          </h1>
          <p className="mt-2 text-[15px] text-ink-3 font-medium leading-relaxed">
            Rejoignez Tornoo et prenez votre tour à distance.
          </p>
        </div>

        {/* Fields */}
        <div className="mt-8 space-y-3">
          <Field icon={User}     value={name}  onChange={setName}  placeholder={t.fullName} />
          <Field icon={Envelope} type="email"  value={email} onChange={setEmail} placeholder={t.emailAddr} />
          <Field icon={Phone}    type="tel"    value={phone} onChange={setPhone} placeholder="Téléphone (optionnel)" />
          <Field
            icon={Lock}
            type={show ? "text" : "password"}
            value={pw}
            onChange={setPw}
            placeholder="Mot de passe (6 caractères min.)"
            right={
              <button onClick={() => setShow((s) => !s)} aria-label="Toggle" className="p-1">
                {show
                  ? <EyeSlash weight="regular" size={18} className="text-ink-3" />
                  : <Eye weight="regular" size={18} className="text-ink-3" />}
              </button>
            }
          />
        </div>

        <div className="mt-6 space-y-3">
          <button
            className="w-full h-14 rounded-[15px] font-extrabold text-white disabled:opacity-40 active:scale-[0.98] transition-transform"
            style={{ background: "linear-gradient(135deg,#07984a,#13b45b)", boxShadow: isValid ? "0 4px 20px rgba(7,152,74,.3)" : "none" }}
            disabled={!isValid}
            onClick={handleSubmit}
          >
            {t.signupBtn}
          </button>

          <p className="text-xs text-ink-3 text-center leading-relaxed px-4">
            En créant un compte, vous acceptez nos{" "}
            <span className="font-bold text-tornoo-green">Conditions d'utilisation</span>{" "}
            et notre{" "}
            <span className="font-bold text-tornoo-green">Politique de confidentialité</span>.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-line" />
            <span className="text-[11px] font-extrabold text-ink-4 tracking-widest uppercase">ou</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <button className="w-full h-14 rounded-[15px] font-bold bg-white border border-line flex items-center justify-center gap-3 shadow-1 text-sm active:scale-[0.98] transition-transform">
            <GoogleG />
            {t.continueGoogle}
          </button>
        </div>

        <p className="text-center text-sm mt-6">
          <span className="text-ink-3">{t.noAccount.replace("?", "").trim()} ?</span>{" "}
          <button onClick={() => router.replace("/login")} className="font-extrabold text-tornoo-green">
            {t.loginTab}
          </button>
        </p>
      </div>
    </div>
  );
}
