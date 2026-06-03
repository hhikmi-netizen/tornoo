"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface Props {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  ease?: string;
}

export function AnimatedNumber({
  value,
  duration = 1.4,
  delay = 0,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  ease = "power3.out",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const obj = useRef({ val: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    obj.current.val = 0;
    const tween = gsap.to(obj.current, {
      val: value,
      duration,
      delay,
      ease,
      onUpdate() {
        if (el) el.textContent = prefix + obj.current.val.toFixed(decimals) + suffix;
      },
    });
    return () => { tween.kill(); };
  }, [value, duration, delay, suffix, prefix, decimals, ease]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
