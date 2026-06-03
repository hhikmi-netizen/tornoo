import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #009B5A 0%, #F5C400 45%, #FF8A00 68%, #EF2B24 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 200 200">
          <path d="M48 135C31 116 27 88 38 64C51 36 80 22 110 28C119 30 127 33 135 38" stroke="white" strokeWidth="24" strokeLinecap="round" fill="none" />
          <path d="M143 45C157 56 166 71 169 88" stroke="white" strokeWidth="24" strokeLinecap="round" fill="none" />
          <path d="M170 104C168 121 160 137 148 149" stroke="white" strokeWidth="24" strokeLinecap="round" fill="none" />
          <path d="M70 93L90 113L132 67" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="66"  cy="154" r="11" fill="white" />
          <circle cx="100" cy="154" r="11" fill="white" />
          <circle cx="134" cy="154" r="11" fill="white" />
          <path d="M47 189C49 171 56 160 66 160C76 160 83 171 85 189H47Z"    fill="white" />
          <path d="M81 189C83 171 90 160 100 160C110 160 117 171 119 189H81Z" fill="white" />
          <path d="M115 189C117 171 124 160 134 160C144 160 151 171 153 189H115Z" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
