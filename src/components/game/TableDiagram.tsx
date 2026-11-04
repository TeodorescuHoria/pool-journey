import { Pt } from "@/data/cards";

interface Props {
  balls: Pt[];
  eight: Pt;
  color: string;
  className?: string;
}

const W = 200;
const H = 100;
const PAD = 9;

/** Masa de biliard văzută de sus, cu bilele traseului. */
export function TableDiagram({ balls, eight, color, className }: Props) {
  const px = (p: Pt) => ({ cx: PAD + (p.x / 2) * (W - 2 * PAD), cy: PAD + p.y * (H - 2 * PAD) });
  const pockets: Pt[] = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
  ];
  const diamonds = [0.25, 0.5, 0.75, 1.25, 1.5, 1.75];
  return (
    <svg viewBox={`-4 -4 ${W + 8} ${H + 8}`} className={className} role="img" aria-label="Schema traseului pe masă">
      <rect x={-4} y={-4} width={W + 8} height={H + 8} rx={8} fill="#5b3a24" />
      <rect x={PAD - 3} y={PAD - 3} width={W - 2 * PAD + 6} height={H - 2 * PAD + 6} rx={3} fill="#147a52" />
      <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="#0d5c3f" />
      {/* linia de start */}
      <line x1={PAD + (W - 2 * PAD) * 0.25} y1={PAD} x2={PAD + (W - 2 * PAD) * 0.25} y2={H - PAD} stroke="#ffffff22" strokeDasharray="2 2" />
      {diamonds.map((d) => (
        <g key={d} fill="#f5e6c8">
          <circle cx={PAD + (d / 2) * (W - 2 * PAD)} cy={2} r={0.9} />
          <circle cx={PAD + (d / 2) * (W - 2 * PAD)} cy={H - 2} r={0.9} />
        </g>
      ))}
      {[0.25, 0.5, 0.75].map((d) => (
        <g key={d} fill="#f5e6c8">
          <circle cx={2} cy={PAD + d * (H - 2 * PAD)} r={0.9} />
          <circle cx={W - 2} cy={PAD + d * (H - 2 * PAD)} r={0.9} />
        </g>
      ))}
      {pockets.map((p, i) => {
        const c = px(p);
        return <circle key={i} cx={c.cx} cy={c.cy} r={4.6} fill="#0b0b0b" />;
      })}
      {balls.map((b, i) => {
        const c = px(b);
        return (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r={3.6} fill={color} stroke="#00000055" strokeWidth={0.5} />
            <circle cx={c.cx} cy={c.cy} r={1.7} fill="#fff" />
            <text x={c.cx} y={c.cy + 1.05} fontSize={2.6} textAnchor="middle" fontWeight={700} fill="#111">
              {i + 1}
            </text>
          </g>
        );
      })}
      {(() => {
        const c = px(eight);
        return (
          <g>
            <circle cx={c.cx} cy={c.cy} r={3.6} fill="#111" stroke="#ffffff55" strokeWidth={0.4} />
            <circle cx={c.cx} cy={c.cy} r={1.7} fill="#fff" />
            <text x={c.cx} y={c.cy + 1.05} fontSize={2.6} textAnchor="middle" fontWeight={700} fill="#111">
              8
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
