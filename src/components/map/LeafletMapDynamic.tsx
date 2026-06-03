"use client";

import dynamic from "next/dynamic";
import type { Establishment } from "@/types";

const LeafletMap = dynamic(
  () => import("./LeafletMap").then((m) => ({ default: m.LeafletMap })),
  { ssr: false, loading: () => <div className="w-full h-full bg-[#e8f0e9] animate-pulse" /> }
);

export { LeafletMap };
