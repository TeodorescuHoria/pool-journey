import { Anchor, Backpack, Route, Swords, Target, Mountain } from "lucide-react";
import { GameCard, KIND_LABEL, TIER_LABEL, Tier } from "@/data/cards";
import { cn } from "@/lib/utils";
import { TableDiagram } from "./TableDiagram";
import { Level } from "@/game/engine";

export const TIER_COLOR: Record<Tier, string> = { 1: "#16a34a", 2: "#ea580c", 3: "#7c3aed" };

const KIND_STYLE = {
  traseu: { icon: Route, ring: "", bg: "bg-white" },
  proba: { icon: Target, ring: "#0e7490", bg: "bg-gradient-to-b from-cyan-50 to-white" },
  duel: { icon: Swords, ring: "#be123c", bg: "bg-gradient-to-b from-rose-50 to-white" },
  handicap: { icon: Anchor, ring: "#57534e", bg: "bg-gradient-to-b from-stone-800 to-stone-950 text-stone-50" },
  echipament: { icon: Backpack, ring: "#ca8a04", bg: "bg-gradient-to-b from-amber-50 to-white" },
} as const;

interface Props {
  card: GameCard;
  level?: Level;
  className?: string;
  compact?: boolean;
}

export function CardFace({ card, level, className, compact }: Props) {
  const st = KIND_STYLE[card.kind];
  const Icon = st.icon;
  const ring = card.kind === "traseu" ? TIER_COLOR[card.tier] : st.ring;
  const dark = card.kind === "handicap";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border-[6px] shadow-xl animate-card-in",
        st.bg,
        compact ? "max-w-[260px]" : "max-w-md",
        className
      )}
      style={{ borderColor: ring }}
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" style={{ color: dark ? "#e7e5e4" : ring }} />
          <span className="font-display text-sm font-extrabold uppercase tracking-widest" style={{ color: dark ? "#e7e5e4" : ring }}>
            {KIND_LABEL[card.kind]}
            {card.kind === "traseu" && ` · ${TIER_LABEL[card.tier]}`}
          </span>
        </div>
        {card.points > 0 && (
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: ring }}
            title="Puncte de altitudine"
          >
            <Mountain className="h-3.5 w-3.5" />+{card.points}
          </span>
        )}
      </div>
      <h3 className={cn("px-4 pt-1 font-display font-extrabold leading-tight", compact ? "text-lg" : "text-2xl")}>{card.title}</h3>

      {card.kind === "traseu" ? (
        <div className="px-3 pb-3 pt-2">
          <TableDiagram balls={card.balls} eight={card.eight} color={ring} className="w-full drop-shadow" />
          {!compact && (
            <p className="mt-2 px-1 text-sm text-muted-foreground">
              {card.text}{" "}
              {level === "avansat" ? (
                <strong className="text-foreground">Ești avansat: neagra (8) se bagă ultima.</strong>
              ) : level === "incepator" ? (
                <strong className="text-foreground">Ești începător: neagra (8) poate intra oricând.</strong>
              ) : (
                "Avansații bagă neagra ultima; începătorii o pot băga oricând."
              )}
            </p>
          )}
        </div>
      ) : (
        <div className={cn("px-4 pb-4 pt-2", compact ? "text-sm" : "text-base")}>
          <p className={cn("leading-relaxed", dark ? "text-stone-200" : "text-foreground/90")}>{card.text}</p>
          {card.kind === "echipament" && (
            <p className="mt-3 rounded-md bg-amber-100/70 px-3 py-1.5 text-xs font-medium text-amber-900">Când: {card.when}</p>
          )}
          {card.kind === "handicap" && (
            <p className="mt-3 rounded-md bg-white/10 px-3 py-1.5 text-xs text-stone-300">
              Bolovanii rămân cu tine până la final (doar echipamentul te poate scăpa de ei). Bonus de curaj: +1 la fiecare traseu reușit cât cari un bolovan.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
