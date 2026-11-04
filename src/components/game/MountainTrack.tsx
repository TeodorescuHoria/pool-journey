import { Player, DEATH_ZONE } from "@/game/engine";

interface Props {
  players: Player[];
  target: number;
  currentId?: string;
}

/** Muntele: fiecare jucător urcă pe potecă în funcție de puncte. */
export function MountainTrack({ players, target, currentId }: Props) {
  // potecă în zig-zag de la bază (stânga jos) la vârf (centru sus)
  const path: [number, number][] = [
    [20, 190], [140, 178], [80, 160], [200, 140], [140, 116], [225, 96], [160, 74], [200, 50], [176, 30], [180, 18],
  ];
  const segLens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const total = segLens.reduce((a, b) => a + b, 0);
  const at = (t: number): [number, number] => {
    let d = Math.min(Math.max(t, 0), 1) * total;
    for (let i = 0; i < segLens.length; i++) {
      if (d <= segLens[i]) {
        const f = d / segLens[i];
        return [path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f];
      }
      d -= segLens[i];
    }
    return path[path.length - 1];
  };
  const dz = at((target - DEATH_ZONE) / target);

  return (
    <svg viewBox="0 0 300 200" className="w-full" role="img" aria-label="Muntele expediției">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#ecfeff" />
        </linearGradient>
        <linearGradient id="rock" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="1" stopColor="#14532d" />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill="url(#sky)" rx="12" />
      <polygon points="0,200 70,120 110,140 180,12 250,110 300,80 300,200" fill="url(#rock)" />
      <polygon points="180,12 158,52 172,46 182,58 194,44 204,50" fill="#ffffff" />
      <polygon points="0,200 40,170 90,185 150,160 220,180 300,150 300,200" fill="#166534" opacity=".85" />
      <polyline points={path.map((p) => p.join(",")).join(" ")} fill="none" stroke="#fde68a" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
      <circle cx={dz[0]} cy={dz[1]} r="3" fill="#dc2626" />
      <text x={dz[0] + 6} y={dz[1] + 3} fontSize="8" fill="#7f1d1d" fontWeight="700">Zona morții</text>
      <text x={180} y={10} fontSize="9" textAnchor="middle" fontWeight="800" fill="#0f172a">Vârf · {target}</text>
      <text x={20} y={198} fontSize="8" fill="#ecfdf5" fontWeight="700">Bază</text>
      {players.map((p, i) => {
        const [x, y] = at(p.points / target);
        const off = (i - (players.length - 1) / 2) * 6;
        const active = p.id === currentId;
        return (
          <g key={p.id} transform={`translate(${x + off} ${y - 4})`}>
            {active && <circle r="8" fill={p.color} opacity=".3" />}
            <circle r="5" fill={p.color} stroke="#fff" strokeWidth="1.5" />
            <text y="2.5" fontSize="6.5" textAnchor="middle" fill="#fff" fontWeight="800">
              {p.name.slice(0, 1).toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
