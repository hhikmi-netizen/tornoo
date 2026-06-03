"use client";

import { Globe, Phone } from "@phosphor-icons/react";

type Platform = "instagram" | "facebook" | "tiktok" | "whatsapp" | "website";

export function SocialIcon({ platform }: { platform: Platform }) {
  if (platform === "instagram") {
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
        </svg>
      </div>
    );
  }

  if (platform === "facebook") {
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#1877F2]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
    );
  }

  if (platform === "tiktok") {
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-black">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.27 8.27 0 004.84 1.55V6.84a4.85 4.85 0 01-1.07-.15z" />
        </svg>
      </div>
    );
  }

  if (platform === "whatsapp") {
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#25D366]">
        <Phone weight="fill" size={16} className="text-white" />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-400">
      <Globe weight="fill" size={16} className="text-white" />
    </div>
  );
}
