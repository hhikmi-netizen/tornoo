export interface ProfessionalPhoto {
  id: string;
  url: string;
  alt?: string;
}

export type OpeningHourDay = "Lun" | "Mar" | "Mer" | "Jeu" | "Ven" | "Sam" | "Dim";

export interface OpeningHour {
  day: OpeningHourDay;
  enabled: boolean;
  open: string;
  close: string;
}

export interface SocialLink {
  id: string;
  platform: "instagram" | "facebook" | "tiktok" | "whatsapp" | "website";
  value: string;
}

export type ProfessionalCategory =
  | "Coiffure & Barbier"
  | "Bien-être & Spa"
  | "Santé & Médecine"
  | "Cliniques"
  | "Dentistes"
  | "Laboratoires"
  | "Pharmacie"
  | "Restauration"
  | "Banque & Finances"
  | "Administration"
  | "Sport & Fitness"
  | "Garages"
  | "Lavage auto"
  | "Autre";

export interface ProfessionalProfile {
  id: string;
  slug: string;
  businessName: string;
  category: ProfessionalCategory;
  description: string;
  address: string;
  city: string;
  area: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isOpen: boolean;
  openingHours: OpeningHour[];
  services: string[];
  photos: ProfessionalPhoto[];
  socialLinks: SocialLink[];
  averageWaitTime: number;
  coverUrl?: string;
  logoUrl?: string;
}
