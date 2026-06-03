"use client";

import { useState } from "react";
import { ProfessionalProfile } from "@/types/professional";

export function useUpdateProfessionalProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const update = async (data: Partial<ProfessionalProfile>): Promise<void> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
  };
  return { update, isLoading };
}
