import Link from "next/link";
import { TornooMark } from "@/components/tornoo/TornooLogo";

export default function NotFound() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 px-8 text-center bg-white">
      <TornooMark size={72} />
      <div>
        <h1 className="text-5xl font-black text-ink">404</h1>
        <p className="text-ink-3 font-medium mt-2">Cette page n'existe pas</p>
      </div>
      <Link
        href="/home"
        className="h-12 px-8 rounded-[15px] bg-tornoo-green text-white font-extrabold text-sm"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
