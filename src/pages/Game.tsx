import { useEffect, useMemo, useReducer, useState } from "react";
import { Backpack, Anchor, Flag, Plus, RotateCcw, Shuffle, Trash2, Trophy, Check, X, Layers, Mountain } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardFace } from "@/components/game/CardFace";
import { MountainTrack } from "@/components/game/MountainTrack";
import { ShotClock } from "@/components/game/ShotClock";
import { CardKind, getCard, KIND_LABEL, HandicapCard } from "@/data/cards";
import {
  Action,
  canUse,
  DEFAULT_SETTINGS,
  GameState,
  inDeathZone,
  Level,
  loadGame,
  newGame,
  reducer,
  saveGame,
  Settings,
} from "@/game/engine";
import { cn } from "@/lib/utils";

export default function Game() {
  const [state, setState] = useState<GameState | null>(() => loadGame());
  return (
    <Layout>
      {state ? (
        <GameBoard
          initial={state}
          onExit={() => {
            saveGame(null);
            setState(null);
          }}
        />
      ) : (
        <Setup onStart={(g) => { saveGame(g); setState(g); }} />
      )}
    </Layout>
  );
}

// ---------------- SETUP ----------------
function Setup({ onStart }: { onStart: (g: GameState) => void }) {
  const [players, setPlayers] = useState<{ name: string; level: Level }[]>([
    { name: "", level: "incepator" },
    { name: "", level: "incepator" },
  ]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const update = (i: number, patch: Partial<{ name: string; level: Level }>) =>
    setPlayers((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold">Pregătește expediția</h1>
      <p className="mt-1 text-muted-foreground">Adaugă jucătorii. Ordinea se trage la sorți la start.</p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Jucători ({players.length}/8)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {players.map((p, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3"
                placeholder={`Jucător ${i + 1}`}
                value={p.name}
                maxLength={20}
                onChange={(e) => update(i, { name: e.target.value })}
              />
              <div className="flex overflow-hidden rounded-md border">
                {(["incepator", "avansat"] as Level[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => update(i, { level: l })}
                    className={cn("px-3 py-2 text-sm font-medium", p.level === l ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary")}
                  >
                    {l === "incepator" ? "Începător" : "Avansat"}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Șterge jucătorul"
                disabled={players.length <= 1}
                onClick={() => setPlayers((ps) => ps.filter((_, j) => j !== i))}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button variant="outline" disabled={players.length >= 8} onClick={() => setPlayers((ps) => [...ps, { name: "", level: "incepator" }])}>
            <Plus /> Adaugă jucător
          </Button>
          <p className="text-xs text-muted-foreground">
            Avansații bagă neagra (8) ultima la trasee; începătorii o pot băga oricând, dar tot trebuie băgată.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Setări</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="text-sm font-medium">Altitudinea vârfului: {settings.target} puncte</label>
            <input
              type="range"
              min={6}
              max={20}
              value={settings.target}
              onChange={(e) => setSettings((s) => ({ ...s, target: Number(e.target.value) }))}
              className="mt-2 w-full accent-[hsl(var(--primary))]"
            />
            <p className="text-xs text-muted-foreground">Mai puține puncte pentru grupuri mari sau timp scurt, mai multe pentru o seară lungă.</p>
          </div>
          <div>
            <p className="text-sm font-medium">Cărți în pachet</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(KIND_LABEL) as CardKind[]).map((k) => (
                <button
                  key={k}
                  disabled={k === "traseu"}
                  onClick={() => setSettings((s) => ({ ...s, kinds: { ...s.kinds, [k]: !s.kinds[k] } }))}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium",
                    settings.kinds[k] ? "border-primary bg-primary/10 text-primary" : "bg-card text-muted-foreground line-through"
                  )}
                >
                  {KIND_LABEL[k]}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button size="lg" className="mt-6 w-full" onClick={() => onStart(newGame(players, settings))}>
        <Flag /> Pornește expediția
      </Button>
    </div>
  );
}

// ---------------- BOARD ----------------
function GameBoard({ initial, onExit }: { initial: GameState; onExit: () => void }) {
  const [state, dispatch] = useReducer(reducer, initial);
  useEffect(() => saveGame(state), [state]);

  const cur = state.players[state.current];
  const phase = state.phase;
  const drawnCard = phase.type === "drawn" ? getCard(phase.cardId) : null;
  const hasClock = useMemo(
    () => cur.handicaps.map((h) => getCard(h) as HandicapCard).find((h) => h.shotClock)?.shotClock,
    [cur.handicaps]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {/* banner jucător curent */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4" style={{ borderLeft: `6px solid ${cur.color}` }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tura {state.turn} · la masă</p>
            <p className="font-display text-2xl font-extrabold">{cur.name}</p>
          </div>
          <Badge className="ml-auto gap-1 border-transparent bg-primary/10 text-primary">
            <Mountain className="h-3.5 w-3.5" /> {cur.points} / {state.settings.target}
          </Badge>
          <Badge className="border-transparent bg-secondary">{cur.level === "avansat" ? "Avansat" : "Începător"}</Badge>
          {inDeathZone(cur, state.settings) && phase.type !== "over" && (
            <Badge className="border-transparent bg-red-100 text-red-700">Zona morții: o ratare = -1</Badge>
          )}
        </div>

        {state.lastEvent && phase.type !== "over" && (
          <p className="rounded-lg bg-secondary/70 px-4 py-2 text-sm">{state.lastEvent}</p>
        )}

        {/* zona de joc */}
        <div className="flex min-h-[380px] flex-col items-center justify-center gap-5 rounded-2xl bg-gradient-to-br from-felt-dark via-felt to-felt-dark p-6">
          {phase.type === "start" && (
            <>
              <div className="relative h-56 w-40">
                {[3, 2, 1].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-2xl border-4 border-white/80 bg-gradient-to-br from-emerald-700 to-emerald-950 shadow-lg"
                    style={{ transform: `translate(${i * 3}px, ${-i * 3}px)` }}
                  />
                ))}
                <div className="absolute inset-0 grid place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-600 to-emerald-900 text-white shadow-xl">
                  <div className="text-center">
                    <Mountain className="mx-auto h-10 w-10" />
                    <p className="mt-1 font-display text-sm font-bold">{state.deck.length} cărți</p>
                  </div>
                </div>
              </div>
              <Button size="lg" variant="accent" onClick={() => dispatch({ type: "draw" })} disabled={state.deck.length + state.discard.length === 0}>
                <Layers /> Trage o carte
              </Button>
              {cur.hand.some((h) => canUse(state, cur.id, h).ok && (() => { const c = getCard(h); return c.kind === "echipament" && ["draw_two", "scavenge"].includes(c.effect); })()) && (
                <p className="text-sm text-emerald-100">Ai echipament pentru începutul turei în rucsac (jos în dreapta).</p>
              )}
            </>
          )}

          {phase.type === "skipped" && (
            <div className="text-center text-white">
              <p className="font-display text-2xl font-extrabold">❄️ Viscol!</p>
              <p className="mt-1 text-emerald-100">{cur.name} pierde această tură.</p>
              <Button className="mt-4" variant="accent" onClick={() => dispatch({ type: "continue_skip" })}>
                Mai departe
              </Button>
            </div>
          )}

          {phase.type === "choose" && (
            <>
              <p className="font-display text-lg font-bold text-white">Harta: alege cartea pe care o joci</p>
              <div className="grid w-full gap-4 sm:grid-cols-2">
                {phase.options.map((id) => (
                  <button key={id} onClick={() => dispatch({ type: "choose", cardId: id })} className="flex justify-center transition hover:scale-[1.02]">
                    <CardFace card={getCard(id)} level={cur.level} compact />
                  </button>
                ))}
              </div>
            </>
          )}

          {phase.type === "drawn" && drawnCard && (
            <>
              <CardFace key={phase.cardId} card={drawnCard} level={cur.level} />
              <DrawnActions state={state} dispatch={dispatch} />
              {(drawnCard.kind === "traseu" || drawnCard.kind === "proba") && (
                <div className="w-full max-w-md">
                  <ShotClock seconds={hasClock ?? 30} highlight={!!hasClock && drawnCard.kind === "traseu"} />
                </div>
              )}
            </>
          )}

          {phase.type === "over" && <Winner state={state} onExit={onExit} />}
        </div>

        {cur.handicaps.length > 0 && phase.type !== "over" && (
          <div className="rounded-xl border bg-stone-900 p-4 text-stone-100">
            <p className="flex items-center gap-2 text-sm font-bold"><Anchor className="h-4 w-4" /> Bolovanii lui {cur.name}</p>
            <ul className="mt-2 space-y-1 text-sm text-stone-300">
              {cur.handicaps.map((h) => (
                <li key={h}>• <strong className="text-white">{getCard(h).title}:</strong> {getCard(h).text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="overflow-hidden rounded-xl border">
          <MountainTrack players={state.players} target={state.settings.target} currentId={cur.id} />
        </div>
        <PlayersPanel state={state} dispatch={dispatch} />
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Jurnalul expediției</CardTitle></CardHeader>
          <CardContent>
            <ul className="max-h-60 space-y-1.5 overflow-y-auto text-sm">
              {state.log.map((l, i) => (
                <li key={i} className="flex gap-2"><span className="w-6 shrink-0 text-xs text-muted-foreground">{l.t}</span><span>{l.text}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => { if (confirm("Abandonezi jocul curent?")) onExit(); }}>
            <RotateCcw /> Joc nou
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Pachet: {state.deck.length} · Decartare: {state.discard.length}. Jocul se salvează automat în acest browser.
        </p>
      </aside>
    </div>
  );
}

function DrawnActions({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  const cur = state.players[state.current];
  const phase = state.phase;
  const [opponent, setOpponent] = useState<string>("");
  if (phase.type !== "drawn") return null;
  const card = getCard(phase.cardId);

  if (card.kind === "traseu" || card.kind === "proba") {
    return (
      <div className="flex w-full max-w-md gap-3">
        <Button size="lg" variant="success" className="flex-1" onClick={() => dispatch({ type: "success" })}>
          <Check /> Reușit
        </Button>
        <Button size="lg" variant="destructive" className="flex-1" onClick={() => dispatch({ type: "fail" })}>
          <X /> Ratat
        </Button>
      </div>
    );
  }
  if (card.kind === "duel") {
    const others = state.players.filter((p) => p.id !== cur.id);
    const opp = state.players.find((p) => p.id === opponent);
    return (
      <div className="w-full max-w-md space-y-3 rounded-xl bg-white/95 p-4">
        <p className="text-sm font-semibold">1. Alege adversarul</p>
        <div className="flex flex-wrap gap-2">
          {others.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpponent(p.id)}
              className={cn("rounded-full border-2 px-3 py-1 text-sm font-medium", opponent === p.id ? "text-white" : "bg-white")}
              style={{ borderColor: p.color, backgroundColor: opponent === p.id ? p.color : undefined }}
            >
              {p.name}
            </button>
          ))}
        </div>
        {opp && (
          <>
            <p className="text-sm font-semibold">2. Cine a câștigat duelul?</p>
            <div className="flex gap-2">
              {[cur, opp].map((p) => (
                <Button key={p.id} className="flex-1" style={{ backgroundColor: p.color }} onClick={() => dispatch({ type: "duel", winnerId: p.id, opponentId: opp.id })}>
                  <Trophy /> {p.name}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  if (card.kind === "handicap") {
    return (
      <Button size="lg" variant="secondary" onClick={() => dispatch({ type: "accept_handicap" })}>
        <Anchor /> Pun bolovanul în spate (se termină tura)
      </Button>
    );
  }
  return (
    <Button size="lg" variant="accent" onClick={() => dispatch({ type: "stash" })}>
      <Backpack /> Pun în rucsac și trag din nou
    </Button>
  );
}

function PlayersPanel({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  const [using, setUsing] = useState<{ owner: string; card: string } | null>(null);
  const sorted = [...state.players];
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">Echipa</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((p, idx) => {
          const active = idx === state.current;
          return (
            <div key={p.id} className={cn("rounded-lg border p-3", active && "ring-2")} style={{ borderLeft: `5px solid ${p.color}`, ...(active ? ({ "--tw-ring-color": p.color } as React.CSSProperties) : {}) }}>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{p.name}</span>
                {p.skipNext && <Badge className="border-transparent bg-sky-100 text-sky-700">❄️ pierde tura</Badge>}
                <span className="ml-auto font-display text-lg font-extrabold">{p.points}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                <span>{p.won.length} cărți câștigate</span>
                {p.handicaps.length > 0 && <span>· {p.handicaps.length} bolovani</span>}
              </div>
              {p.hand.length > 0 && (
                <div className="mt-2 space-y-1">
                  {p.hand.map((h, i) => {
                    const c = getCard(h);
                    const u = canUse(state, p.id, h);
                    return (
                      <div key={h + i} className="flex items-center gap-2 rounded-md bg-amber-50 px-2 py-1 text-sm">
                        <Backpack className="h-3.5 w-3.5 text-amber-700" />
                        <span className="font-medium text-amber-950" title={c.text}>{c.title}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-auto h-7 px-2 text-xs"
                          disabled={!u.ok}
                          title={!u.ok && c.kind === "echipament" ? c.when : c.text}
                          onClick={() => {
                            if (u.needsTarget || u.needsHandicap) setUsing({ owner: p.id, card: h });
                            else dispatch({ type: "use", playerId: p.id, cardId: h });
                          }}
                        >
                          {c.kind === "echipament" && c.effect === "shelter" ? "pasiv" : "Folosește"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              {using?.owner === p.id && (
                <UsePicker
                  state={state}
                  ownerId={p.id}
                  cardId={using.card}
                  onCancel={() => setUsing(null)}
                  onConfirm={(targetId, handicapId) => {
                    dispatch({ type: "use", playerId: p.id, cardId: using.card, targetId, handicapId });
                    setUsing(null);
                  }}
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function UsePicker({
  state,
  ownerId,
  cardId,
  onCancel,
  onConfirm,
}: {
  state: GameState;
  ownerId: string;
  cardId: string;
  onCancel: () => void;
  onConfirm: (targetId?: string, handicapId?: string) => void;
}) {
  const u = canUse(state, ownerId, cardId);
  const owner = state.players.find((p) => p.id === ownerId)!;
  const [target, setTarget] = useState<string>("");
  const [handicap, setHandicap] = useState<string>(owner.handicaps[0] ?? "");
  const targets = state.players.filter((p) => p.id !== ownerId && (u.needsTarget !== "playerWithHand" || p.hand.length > 0));
  const ready = (!u.needsTarget || target) && (!u.needsHandicap || handicap);
  return (
    <div className="mt-2 space-y-2 rounded-md border bg-background p-2 text-sm">
      <p className="font-semibold">{getCard(cardId).title}: {getCard(cardId).text}</p>
      {u.needsHandicap && (
        <select className="w-full rounded border bg-background p-1.5" value={handicap} onChange={(e) => setHandicap(e.target.value)}>
          {owner.handicaps.map((h) => <option key={h} value={h}>{getCard(h).title}</option>)}
        </select>
      )}
      {u.needsTarget && (
        <select className="w-full rounded border bg-background p-1.5" value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="">Alege jucătorul…</option>
          {targets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      )}
      <div className="flex gap-2">
        <Button size="sm" disabled={!ready} onClick={() => onConfirm(target || undefined, handicap || undefined)}>Confirmă</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Renunță</Button>
      </div>
    </div>
  );
}

function Winner({ state, onExit }: { state: GameState; onExit: () => void }) {
  if (state.phase.type !== "over") return null;
  const winnerId = state.phase.winnerId;
  const w = state.players.find((p) => p.id === winnerId)!;
  const ranking = [...state.players].sort((a, b) => b.points - a.points);
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl animate-card-in">
      <Trophy className="mx-auto h-12 w-12 text-amber-500" />
      <h2 className="mt-2 text-3xl font-extrabold">{w.name} a cucerit vârful!</h2>
      <ol className="mt-4 space-y-1 text-left">
        {ranking.map((p, i) => (
          <li key={p.id} className="flex items-center gap-2 rounded-md px-3 py-1.5" style={{ backgroundColor: i === 0 ? "#fef3c7" : undefined }}>
            <span className="w-5 font-bold">{i + 1}.</span>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
            <span>{p.name}</span>
            <span className="ml-auto font-display font-extrabold">{p.points}</span>
          </li>
        ))}
      </ol>
      <Button className="mt-5 w-full" onClick={onExit}><Shuffle /> Expediție nouă</Button>
    </div>
  );
}

