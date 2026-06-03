// Realistic-looking QR code SVG with Tornoo logo in center
const MODULES: number[] = [
  1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,1,1,1,
  1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,
  1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1,
  1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,
  1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,1,0,1,
  1,0,0,0,0,0,1,0,1,0,0,1,1,0,1,0,0,0,0,0,1,
  1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
  0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,
  1,0,1,1,0,0,1,1,0,1,1,0,1,1,0,0,1,0,1,1,0,
  0,1,1,0,1,0,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,
  1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,1,0,
  0,1,1,0,0,1,0,1,1,1,0,0,0,1,1,0,1,1,1,0,1,
  1,0,0,1,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,
  0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,0,0,1,1,1,
  1,1,1,1,1,1,1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,
  1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,0,
  1,0,1,1,1,0,1,0,0,1,0,0,1,0,0,0,1,0,1,0,1,
  1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0,
  1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,1,1,0,1,0,1,
  1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1,0,
  1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,0,0,1,0,1,
];

interface Props {
  size?: number;
  logoSize?: number;
  className?: string;
}

export function QRCodeSVG({ size = 200, logoSize = 36, className }: Props) {
  const cols = 21;
  const padding = 8;
  const cellSize = (size - padding * 2) / cols;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="QR Code Tornoo"
    >
      <rect width={size} height={size} fill="white" />
      {MODULES.map((on, i) => {
        if (!on) return null;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = padding + col * cellSize;
        const y = padding + row * cellSize;
        // Mask center area for logo
        const midStart = 8, midEnd = 12;
        if (row >= midStart && row <= midEnd && col >= midStart && col <= midEnd) return null;
        return (
          <rect
            key={i}
            x={x + 0.3}
            y={y + 0.3}
            width={cellSize - 0.6}
            height={cellSize - 0.6}
            rx={cellSize * 0.15}
            fill="#071A2A"
          />
        );
      })}

      {/* Tornoo logo mark in center */}
      <circle cx={center} cy={center} r={logoSize / 2 + 4} fill="white" />
      <circle cx={center} cy={center} r={logoSize / 2} fill="white" stroke="#e5e7eb" strokeWidth="1" />

      {/* Simplified Tornoo mark — gradient arc + checkmark + 3 people */}
      <g transform={`translate(${center - 11} ${center - 13})`}>
        <path d="M3 9C2 7 2 5 3 3C4 1 6 0 8 0C9 0 10 0 11 1" stroke="url(#qrGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M12 1C13 2 14 3 14 5" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M14 6C14 8 13 9 12 10" stroke="#EF2B24" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M5 6L7 8L10 4" stroke="#0B1B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="5" cy="13" r="1.2" fill="#39B54A" />
        <circle cx="8" cy="13" r="1.2" fill="#FFB000" />
        <circle cx="11" cy="13" r="1.2" fill="#EF2B24" />
        <path d="M3.5 17C3.7 15 4.5 14 5 14C5.5 14 6.3 15 6.5 17H3.5Z" fill="#39B54A" />
        <path d="M6.5 17C6.7 15 7.5 14 8 14C8.5 14 9.3 15 9.5 17H6.5Z" fill="#FFB000" />
        <path d="M9.5 17C9.7 15 10.5 14 11 14C11.5 14 12.3 15 12.5 17H9.5Z" fill="#EF2B24" />
        <defs>
          <linearGradient id="qrGrad" x1="0" y1="0" x2="14" y2="0">
            <stop offset="0%" stopColor="#009B5A" />
            <stop offset="100%" stopColor="#F5C400" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}
