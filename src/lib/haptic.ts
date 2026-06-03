export function haptic(type: "light" | "medium" | "heavy" = "light") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const patterns: Record<string, number | number[]> = {
    light: 8,
    medium: 18,
    heavy: [25, 10, 25],
  };
  navigator.vibrate(patterns[type]);
}
