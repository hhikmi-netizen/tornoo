"use client";

import { useState, useEffect } from "react";
import { ProfessionalProfile } from "@/types/professional";
import { MOCK_PRO_PROFILE } from "@/data/mockProfessionalProfile";

export function useProfessionalProfile(slug?: string) {
  const [data, setData] = useState<ProfessionalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_PRO_PROFILE);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [slug]);
  return { data, isLoading };
}
