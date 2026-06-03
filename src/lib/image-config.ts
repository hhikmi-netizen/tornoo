// Central registry of all images used in Tornoo.
// Single source of truth — update here to change everywhere.

const UNSPLASH = "https://images.unsplash.com";

/** Build a standardised Unsplash URL */
export function imgUrl(id: string, w = 900, q = 82): string {
  return `${UNSPLASH}/${id}?q=${q}&w=${w}&auto=format&fit=crop`;
}

// ---------------------------------------------------------------------------
// Establishment category → curated Unsplash photo ID
// ---------------------------------------------------------------------------
const CATEGORY_IDS: Record<string, string> = {
  "Coiffure & Barbier": "photo-1503951914875-452162b0f3f1", // barber cutting hair
  "Bien-être & Spa":    "photo-1544161515-4ab6ce6db874", // spa stones & candles
  "Santé":              "photo-1519494026892-80bbd2d6fd0d", // clinic corridor
  "Administration":     "photo-1486325212027-8081e485255e", // civic/government building
  "Pharmacie":          "photo-1471864190281-a93a3070b6de", // pharmacy shelves
  "Restauration":       "photo-1414235077428-338989a2e8c0", // restaurant dining
  "Banque":             "photo-1556742049-0cfed4f6a45d",   // bank lobby
  "Education":          "photo-1580582932707-520aed937b7b", // classroom
};

const FALLBACK_ID = "photo-1486325212027-8081e485255e";

/** Get a category image URL (fallback when no specific imageUrl is set) */
export function getCategoryImage(category: string, w = 900): string {
  const id = CATEGORY_IDS[category] ?? FALLBACK_ID;
  return imgUrl(id, w);
}

// ---------------------------------------------------------------------------
// Named image URLs — keep these in sync with remotePatterns in next.config.ts
// ---------------------------------------------------------------------------

/** User avatar — male professional portrait */
export const USER_AVATAR_URL = imgUrl("photo-1507003211169-0a1dd7228f2d", 200, 85);

// ---------------------------------------------------------------------------
// next/image `sizes` presets
// These must match the actual rendered CSS dimensions to avoid over-fetching.
// ---------------------------------------------------------------------------
export const IMG_SIZES = {
  cardRow:     "96px",
  cardCompact: "64px",
  heroFull:    "(max-width: 768px) 100vw, 768px",
  heroThumb:   "80px",
  avatar:      "40px",
  avatarLg:    "70px",
} as const;
