"use client";

import { useState } from "react";
import Image from "next/image";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Image>, "onError"> & {
  fallback: React.ReactNode;
};

export function ImageWithFallback({ fallback, src, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return <Image src={src} {...props} onError={() => setFailed(true)} />;
}
