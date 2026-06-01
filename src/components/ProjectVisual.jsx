import { memo } from "react";

// brand palette
const A = "#d6bc82"; // amber
const T = "#7fd8d0"; // teal
const W = "#f4f4f6"; // bone

const ctr = { transformBox: "fill-box", transformOrigin: "center" };
const bottom = { transformBox: "fill-box", transformOrigin: "center bottom" };

/* ---- individual motifs (inner SVG, drawn in a 400×200 viewBox) ---- */

const Assistant = () => (
  <g>
    {/* incoming bubble */}
    <rect x="58" y="56" width="118" height="44" rx="14" fill="none" stroke={T} strokeOpacity="0.5" strokeWidth="2" />
    <line x1="76" y1="72" x2="150" y2="72" stroke={T} strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
    <line x1="76" y1="84" x2="126" y2="84" stroke={T} strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" />
    {/* reply bubble with typing dots */}
    <rect x="212" y="106" width="128" height="46" rx="14" fill={A} fillOpacity="0.14" stroke={A} strokeOpacity="0.5" strokeWidth="2" />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={246 + i * 24} cy="129" r="6" fill={A} style={{ ...ctr, animation: `pv-dot 1.2s ease-in-out ${i * 0.18}s infinite` }} />
    ))}
    {/* sparkle */}
    <path d="M322 40 l5 13 13 5 -13 5 -5 13 -5 -13 -13 -5 13 -5 z" fill={A} style={{ ...ctr, animation: "pv-twinkle 2.6s ease-in-out infinite" }} />
  </g>
);

const Conveyor = () => (
  <g>
    <line x1="0" y1="150" x2="400" y2="150" stroke={W} strokeOpacity="0.14" strokeWidth="2" />
    <g style={{ animation: "pv-belt 1.7s linear infinite" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={18 + i * 100} y="116" width="58" height="30" rx="5" fill="none" stroke={T} strokeOpacity="0.55" strokeWidth="2" />
      ))}
    </g>
    <g style={{ ...ctr, animation: "pv-spin 7s linear infinite" }}>
      <circle cx="328" cy="62" r="26" fill="none" stroke={A} strokeOpacity="0.5" strokeWidth="3" />
      <circle cx="328" cy="62" r="8" fill={A} fillOpacity="0.35" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x="326" y="32" width="4" height="9" rx="1" fill={A} fillOpacity="0.7" transform={`rotate(${i * 45} 328 62)`} />
      ))}
    </g>
  </g>
);

const Gauge = () => (
  <g transform="rotate(-90 200 104)">
    <circle cx="200" cy="104" r="58" fill="none" stroke={W} strokeOpacity="0.12" strokeWidth="10" />
    <circle
      cx="200" cy="104" r="58" fill="none" stroke="url(#pvAT)" strokeWidth="10" strokeLinecap="round"
      strokeDasharray="364"
      style={{ "--c": "364px", "--c4": "15px", strokeDashoffset: "364px", animation: "pv-sweep 3.4s ease-in-out infinite" }}
    />
  </g>
);

const Triage = () => {
  const pts = "0,108 70,108 92,108 104,84 116,132 128,108 196,108 214,108 228,66 242,150 256,108 320,108 344,108 400,108";
  return (
    <g>
      <polyline points={pts} fill="none" stroke={T} strokeOpacity="0.2" strokeWidth="2.5" />
      <polyline points={pts} fill="none" stroke={A} strokeWidth="3" strokeLinejoin="round" pathLength="1000" strokeDasharray="70 930" style={{ animation: "pv-trace 2.6s linear infinite" }} />
      <circle cx="235" cy="66" r="6" fill={A} style={{ ...ctr, animation: "pv-pulse 1.6s ease-in-out infinite" }} />
    </g>
  );
};

const Classify = () => (
  <g>
    <rect x="40" y="80" width="44" height="54" rx="4" fill="none" stroke={W} strokeOpacity="0.22" strokeWidth="2" />
    <rect x="50" y="72" width="44" height="54" rx="4" fill="none" stroke={W} strokeOpacity="0.16" strokeWidth="2" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x="298" y={54 + i * 44} width="76" height="32" rx="6" fill="none" stroke={i === 1 ? A : T} strokeOpacity="0.5" strokeWidth="2" />
    ))}
    {[0, 1, 2].map((i) => (
      <circle key={i} cx="120" cy={70 + i * 44} r="5" fill={i === 1 ? A : T} style={{ animation: `pv-travel 2s ease-in ${i * 0.45}s infinite` }} />
    ))}
  </g>
);

const Cloud = () => (
  <g>
    <g fill={T} fillOpacity="0.12">
      <circle cx="178" cy="70" r="22" />
      <circle cx="208" cy="62" r="27" />
      <circle cx="238" cy="72" r="20" />
      <rect x="158" y="70" width="100" height="26" rx="13" />
    </g>
    <g stroke={W} strokeOpacity="0.14" strokeWidth="1.5">
      <line x1="200" y1="92" x2="92" y2="138" />
      <line x1="208" y1="96" x2="208" y2="148" />
      <line x1="216" y1="92" x2="312" y2="138" />
    </g>
    {[[92, 138], [208, 148], [312, 138]].map(([x, y], i) => (
      <rect key={i} x={x - 13} y={y - 13} width="26" height="26" rx="5" fill={A} fillOpacity="0.12" stroke={A} strokeOpacity="0.5" strokeWidth="2" style={{ ...ctr, animation: `pv-pulse 2.6s ease-in-out ${i * 0.3}s infinite` }} />
    ))}
    {[[92, 138], [208, 148], [312, 138]].map(([x, y], i) => (
      <circle key={`p${i}`} cx="208" cy="92" r="3.5" fill={A} style={{ "--dx": `${x - 208}px`, "--dy": `${y - 92}px`, animation: `pv-pkt 2.1s ease-in ${i * 0.45}s infinite` }} />
    ))}
  </g>
);

const Aus = () => (
  <g>
    <line x1="40" y1="160" x2="362" y2="160" stroke={W} strokeOpacity="0.14" strokeWidth="2" />
    {[40, 72, 54, 92, 64].map((h, i) => (
      <rect key={i} x={70 + i * 54} y={160 - h} width="32" height={h} rx="3" fill="url(#pvAT)" fillOpacity="0.5" style={{ ...bottom, animation: `pv-rise 2.6s ease-in-out ${i * 0.2}s infinite` }} />
    ))}
    {[[118, 50], [250, 38], [300, 62]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="5" fill={T} style={{ ...ctr, animation: `pv-pulse 2s ease-in-out ${i * 0.4}s infinite` }} />
    ))}
  </g>
);

function Table({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill={W} fillOpacity="0.02" stroke={W} strokeOpacity="0.2" strokeWidth="1.5" />
      <rect x={x} y={y} width={w} height="14" rx="5" fill={A} fillOpacity="0.18" />
      <line x1={x + 10} y1={y + 28} x2={x + w - 10} y2={y + 28} stroke={W} strokeOpacity="0.14" strokeWidth="2" />
      <line x1={x + 10} y1={y + 40} x2={x + w - 18} y2={y + 40} stroke={W} strokeOpacity="0.1" strokeWidth="2" />
    </g>
  );
}

const Er = () => (
  <g>
    <g fill="none" stroke={A} strokeOpacity="0.45" strokeWidth="2">
      <path d="M128 70 H 250" strokeDasharray="122" style={{ "--len": "122px", strokeDashoffset: "122px", animation: "pv-draw 1.3s ease-out 0.1s forwards" }} />
      <path d="M118 138 H 250" strokeDasharray="132" style={{ "--len": "132px", strokeDashoffset: "132px", animation: "pv-draw 1.3s ease-out 0.35s forwards" }} />
    </g>
    <circle cx="250" cy="70" r="3.5" fill={A} />
    <circle cx="250" cy="138" r="3.5" fill={A} />
    <Table x="44" y="48" w="84" h="52" />
    <Table x="250" y="56" w="106" h="64" />
    <Table x="74" y="120" w="92" h="52" />
  </g>
);

const Climate = () => {
  const line = "M30 150 L100 134 L160 122 L222 96 L290 70 L362 46";
  return (
    <g>
      <g stroke={W} strokeOpacity="0.08" strokeWidth="1">
        <line x1="30" y1="60" x2="370" y2="60" />
        <line x1="30" y1="108" x2="370" y2="108" />
        <line x1="30" y1="156" x2="370" y2="156" />
      </g>
      <circle cx="330" cy="48" r="18" fill={A} fillOpacity="0.3" style={{ ...ctr, animation: "pv-pulse 3s ease-in-out infinite" }} />
      <path d={`${line} L362 176 L30 176 Z`} fill="url(#pvArea)" opacity="0.55" />
      <path d={line} fill="none" stroke="url(#pvAT)" strokeWidth="3" strokeLinejoin="round" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: "1000px", animation: "pv-draw 2.4s ease-out forwards" }} />
    </g>
  );
};

const MOTIFS = {
  assistant: Assistant,
  conveyor: Conveyor,
  gauge: Gauge,
  triage: Triage,
  classify: Classify,
  cloud: Cloud,
  aus: Aus,
  er: Er,
  climate: Climate,
};

function ProjectVisual({ render }) {
  const Motif = MOTIFS[render] || Assistant;
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="pv absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="pvAT" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={A} />
          <stop offset="1" stopColor={T} />
        </linearGradient>
        <radialGradient id="pvGlow" cx="50%" cy="42%" r="62%">
          <stop offset="0" stopColor={T} stopOpacity="0.16" />
          <stop offset="1" stopColor={T} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pvArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={A} stopOpacity="0.28" />
          <stop offset="1" stopColor={A} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#pvGlow)" />
      <Motif />
    </svg>
  );
}

export default memo(ProjectVisual);
