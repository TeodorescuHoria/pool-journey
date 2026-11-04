import { useEffect, useMemo, useState } from "react";
import { Check, X, Trophy, Play, TrendingUp, ListChecks } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardFace } from "@/components/game/CardFace";
import { ShotClock } from "@/components/game/ShotClock";
import { ALL_CARDS, getCard, Tier, TIER_LABEL, TraseuCard } from "@/data/cards";
import { shuffle } from "@/game/engine";
import { cn } from "@/lib/utils";

type Mode = "runde" | "escalada";
const ROUNDS = 3;
const PER_ROUND = 5;

const readBest = (key: string) => {
  try { return Number(localStorage.getItem(key) ?? 0) || 0; } catch { return 0; }
};
const writeBest = (key: string, v: number) => {
  try { localStorage.setItem(key, String(v)); } catch { /* ignorat */ }
};

export default function Solo() {
  const [mode, setMode] = useState<Mode | null>(null);
  return (
    <Layout>
      {mode === null && <SoloMenu onPick={setMode} />}
      {mode === "runde" && <Rounds onExit={() => setMode(null)} />}
      {mode === "escalada" && <Escalation onExit={() => setMode(null)} />}
    </Layout>
  );
}

function SoloMenu({ onPick }: { onPick: (m: Mode) => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold">Antrenament solo</h1>
      <p className="mt-1 text-muted-foreground">Exersează singur la masă. Recordurile se păstrează în acest browser.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /> Cele 3 runde</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Primești {ROUNDS} runde a câte {PER_ROUND} cărți (trasee și probe). Fiecare reușită îți aduce punctele cărții. Bate-ți recordul total.</p>
            <p className="font-semibold text-foreground">Record: {readBest("pool-journey:record-runde")} puncte</p>
            <Button onClick={() => onPick("runde")}><Play /> Începe</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-accent" /> Escalada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Doar trasee. Pornești de la Ușor; după 2 reușite la rând urci un nivel. Fiecare traseu reușit valorează cât nivelul lui. La a treia ratare, escalada se termină.</p>
            <p className="font-semibold text-foreground">Record: {readBest("pool-journey:record-escalada")} puncte</p>
            <Button variant="accent" onClick={() => onPick("escalada")}><Play /> Începe</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Rounds({ onExit }: { onExit: () => void }) {
  const pool = useMemo(() => ALL_CARDS.filter((c) => c.kind === "traseu" || c.kind === "proba").map((c) => c.id), []);
  const [deck] = useState(() => shuffle(pool).slice(0, ROUNDS * PER_ROUND));
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [level, setLevel] = useState<"incepator" | "avansat">("incepator");

  const done = idx >= deck.length;
  const roundScores = Array.from({ length: ROUNDS }, (_, r) =>
    results.slice(r * PER_ROUND, (r + 1) * PER_ROUND).reduce((sum, ok, i) => sum + (ok ? getCard(deck[r * PER_ROUND + i]).points : 0), 0)
  );
  const total = roundScores.reduce((a, b) => a + b, 0);
  const key = "pool-journey:record-runde";
  const [best, setBest] = useState(() => readBest(key));

  useEffect(() => {
    if (done && total > best) { writeBest(key, total); setBest(total); }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const mark = (ok: boolean) => { setResults((r) => [...r, ok]); setIdx((i) => i + 1); };
  const round = Math.min(Math.floor(idx / PER_ROUND) + 1, ROUNDS);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 rounded-2xl bg-gradient-to-br from-felt-dark via-felt to-felt-dark p-6">
        {!done ? (
          <>
            <p className="font-display font-bold text-white">Runda {round} din {ROUNDS} · cartea {(idx % PER_ROUND) + 1} din {PER_ROUND}</p>
            <CardFace key={deck[idx]} card={getCard(deck[idx])} level={level} />
            <div className="flex w-full max-w-md gap-3">
              <Button size="lg" variant="success" className="flex-1" onClick={() => mark(true)}><Check /> Reușit</Button>
              <Button size="lg" variant="destructive" className="flex-1" onClick={() => mark(false)}><X /> Ratat</Button>
            </div>
            <div className="w-full max-w-md"><ShotClock /></div>
          </>
        ) : (
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <Trophy className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-2 text-3xl font-extrabold">{total} puncte</h2>
            <p className="text-muted-foreground">{total >= best ? "Record nou sau egalat!" : `Recordul tău: ${best}`}</p>
            <Button className="mt-5 w-full" onClick={onExit}>Înapoi la meniu</Button>
          </div>
        )}
      </div>
      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Scor</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {roundScores.map((s, i) => (
              <div key={i} className="flex justify-between"><span>Runda {i + 1}</span><strong>{s}</strong></div>
            ))}
            <div className="flex justify-between border-t pt-2 text-base"><span>Total</span><strong>{total}</strong></div>
            <div className="flex justify-between text-muted-foreground"><span>Record</span><span>{best}</span></div>
          </CardContent>
        </Card>
        <LevelToggle level={level} setLevel={setLevel} />
        <Button variant="outline" className="w-full" onClick={onExit}>Renunță</Button>
      </aside>
    </div>
  );
}

function Escalation({ onExit }: { onExit: () => void }) {
  const byTier = (t: Tier) => shuffle(ALL_CARDS.filter((c): c is TraseuCard => c.kind === "traseu" && c.tier === t).map((c) => c.id));
  const [tier, setTier] = useState<Tier>(1);
  const [queue, setQueue] = useState<Record<Tier, string[]>>(() => ({ 1: byTier(1), 2: byTier(2), 3: byTier(3) }));
  const [streak, setStreak] = useState(0);
  const [misses, setMisses] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<"incepator" | "avansat">("incepator");
  const key = "pool-journey:record-escalada";
  const [best, setBest] = useState(() => readBest(key));
  const done = misses >= 3;
  const cardId = queue[tier][0];

  useEffect(() => {
    if (done && score > best) { writeBest(key, score); setBest(score); }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const advanceQueue = () =>
    setQueue((q) => {
      const rest = q[tier].slice(1);
      return { ...q, [tier]: rest.length ? rest : byTier(tier) };
    });

  const mark = (ok: boolean) => {
    advanceQueue();
    if (ok) {
      setScore((s) => s + tier);
      const ns = streak + 1;
      if (ns >= 2 && tier < 3) { setTier((t) => (t + 1) as Tier); setStreak(0); } else setStreak(ns);
    } else {
      setMisses((m) => m + 1);
      setStreak(0);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 rounded-2xl bg-gradient-to-br from-felt-dark via-felt to-felt-dark p-6">
        {!done ? (
          <>
            <p className="font-display font-bold text-white">Nivel: {TIER_LABEL[tier]} · reușite la rând: {streak}</p>
            <CardFace key={cardId + score + misses} card={getCard(cardId)} level={level} />
            <div className="flex w-full max-w-md gap-3">
              <Button size="lg" variant="success" className="flex-1" onClick={() => mark(true)}><Check /> Reușit</Button>
              <Button size="lg" variant="destructive" className="flex-1" onClick={() => mark(false)}><X /> Ratat</Button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <Trophy className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-2 text-3xl font-extrabold">{score} puncte</h2>
            <p className="text-muted-foreground">{score >= best ? "Record nou sau egalat!" : `Recordul tău: ${best}`}</p>
            <Button className="mt-5 w-full" onClick={onExit}>Înapoi la meniu</Button>
          </div>
        )}
      </div>
      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Escalada</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Puncte</span><strong>{score}</strong></div>
            <div className="flex justify-between"><span>Ratări</span><strong>{misses} / 3</strong></div>
            <div className="flex gap-1 pt-1">
              {[1, 2, 3].map((t) => (
                <div key={t} className={cn("h-2 flex-1 rounded-full", t <= tier ? "bg-accent" : "bg-secondary")} />
              ))}
            </div>
            <div className="flex justify-between text-muted-foreground"><span>Record</span><span>{best}</span></div>
          </CardContent>
        </Card>
        <LevelToggle level={level} setLevel={setLevel} />
        <Button variant="outline" className="w-full" onClick={onExit}>Renunță</Button>
      </aside>
    </div>
  );
}

function LevelToggle({ level, setLevel }: { level: "incepator" | "avansat"; setLevel: (l: "incepator" | "avansat") => void }) {
  return (
    <div className="flex overflow-hidden rounded-md border text-sm">
      {(["incepator", "avansat"] as const).map((l) => (
        <button key={l} onClick={() => setLevel(l)} className={cn("flex-1 px-3 py-2 font-medium", level === l ? "bg-primary text-primary-foreground" : "bg-card")}>
          {l === "incepator" ? "Începător" : "Avansat"}
        </button>
      ))}
    </div>
  );
}
