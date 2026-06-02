export function CityBackdrop() {
  return (
    <svg
      viewBox="0 0 390 230"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ height: 230 }}
    >
      <g opacity="0.06" fill="#071A2A">
        <rect x="20" y="120" width="34" height="90" rx="3" />
        <rect x="60" y="95" width="26" height="115" rx="3" />
        <rect x="300" y="105" width="30" height="105" rx="3" />
        <rect x="336" y="130" width="22" height="80" rx="3" />
        <rect x="92" y="135" width="20" height="75" rx="3" />
        <rect x="262" y="125" width="24" height="85" rx="3" />
        <path d="M72 95l13-12 13 12z" />
        <path d="M306 105l15-13 15 13z" />
        <g>
          <rect x="28" y="132" width="6" height="8" />
          <rect x="40" y="132" width="6" height="8" />
          <rect x="28" y="150" width="6" height="8" />
          <rect x="40" y="150" width="6" height="8" />
        </g>
      </g>
      <g opacity="0.07" fill="#07984A">
        <g transform="translate(40 168)">
          <rect x="-2" y="20" width="4" height="22" fill="#5b6472" opacity=".5" />
          <circle r="20" />
        </g>
        <g transform="translate(355 176)">
          <rect x="-2" y="16" width="4" height="20" fill="#5b6472" opacity=".5" />
          <circle r="16" />
        </g>
        <g transform="translate(110 184)">
          <rect x="-2" y="12" width="3" height="16" fill="#5b6472" opacity=".5" />
          <circle r="13" />
        </g>
      </g>
      <path d="M0 200 Q120 170 210 196 T390 188 V230 H0 Z" fill="#07984A" opacity="0.05" />
      <path d="M0 214 Q160 188 260 210 T390 206 V230 H0 Z" fill="#07984A" opacity="0.05" />
    </svg>
  );
}
