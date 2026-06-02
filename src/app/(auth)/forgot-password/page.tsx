"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CaretLeft, Envelope, CheckCircle } from "@phosphor-icons/react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-surface-2 min-h-svh">
      <div className="px-4 pt-safe-top pb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 mt-2 text-ink-2 font-bold"
          aria-label="Retour"
        >
          <CaretLeft weight="bold" size={20} />
          Retour
        </button>

        {/* Icon */}
        <div className="flex justify-center mt-8 mb-6">
          <div className="w-20 h-20 rounded-[24px] bg-surface flex items-center justify-center border border-line shadow-1">
            {sent
              ? <CheckCircle weight="fill" size={36} className="text-tornoo-green" />
              : <Envelope weight="duotone" size={36} className="text-ink-3" />
            }
          </div>
        </div>

        <h1 className="text-2xl font-black text-ink text-center">Mot de passe oublié</h1>
        <p className="mt-3 text-sm text-ink-3 text-center max-w-sm mx-auto leading-relaxed">
          {sent
            ? "Un lien de réinitialisation a été envoyé à votre adresse e-mail."
            : "Entrez votre e-mail, nous vous enverrons un lien de réinitialisation."}
        </p>

        {!sent ? (
          <>
            <div className="mt-8 flex items-center gap-3 bg-white rounded-[14px] px-4 h-14 border border-line">
              <Envelope weight="duotone" size={19} className="text-ink-3 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse e-mail"
                className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-3"
              />
            </div>
            <button
              className="mt-4 w-full h-14 rounded-[15px] font-extrabold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#07984a,#13b45b)" }}
              disabled={!email.includes("@")}
              onClick={() => setSent(true)}
            >
              Envoyer le lien
            </button>
          </>
        ) : (
          <button
            className="mt-8 w-full h-14 rounded-[15px] font-bold bg-surface border border-line text-ink-2"
            onClick={() => router.push("/login")}
          >
            Retour à la connexion
          </button>
        )}
      </div>
    </div>
  );
}
