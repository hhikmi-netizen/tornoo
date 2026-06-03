import type { ProfessionalProfile } from "@/types/professional";

export const MOCK_PRO_PROFILE: ProfessionalProfile = {
  id: "1",
  slug: "barber-club-maarif",
  businessName: "Barber Club",
  category: "Coiffure & Barbier",
  description:
    "Le meilleur barber de Mâarif. Style, précision et satisfaction. Une équipe passionnée à votre service pour une coupe parfaite.",
  address: "123 Rue Al Massira, Mâarif",
  city: "Casablanca",
  area: "Mâarif",
  phone: "+212 6 12 34 56 78",
  email: "contact@barberclub.ma",
  website: "barberclub.ma",
  rating: 4.8,
  reviewsCount: 128,
  isVerified: true,
  isOpen: true,
  openingHours: [
    { day: "Lun", enabled: true, open: "09:00", close: "21:00" },
    { day: "Mar", enabled: true, open: "09:00", close: "21:00" },
    { day: "Mer", enabled: true, open: "09:00", close: "21:00" },
    { day: "Jeu", enabled: true, open: "09:00", close: "21:00" },
    { day: "Ven", enabled: true, open: "09:00", close: "21:00" },
    { day: "Sam", enabled: true, open: "09:00", close: "22:00" },
    { day: "Dim", enabled: true, open: "10:00", close: "20:00" },
  ],
  services: [
    "Coupe homme",
    "Coupe + barbe",
    "Coloration",
    "Soin capillaire",
    "Taillage de barbe",
  ],
  photos: [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop",
      alt: "Barber at work",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop",
      alt: "Haircut",
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=400&auto=format&fit=crop",
      alt: "Barber shop interior",
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop",
      alt: "Beard trim",
    },
  ],
  socialLinks: [
    { id: "sl1", platform: "instagram", value: "@barberclub.ma" },
    { id: "sl2", platform: "facebook", value: "Barber Club" },
    { id: "sl3", platform: "tiktok", value: "@barberclub.ma" },
    { id: "sl4", platform: "whatsapp", value: "+212 6 12 34 56 78" },
  ],
  averageWaitTime: 15,
  coverUrl:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=900&auto=format&fit=crop",
  logoUrl:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=900&auto=format&fit=crop",
};
