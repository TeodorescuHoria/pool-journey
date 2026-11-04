import { ALL_CARDS, CardKind, getCard, Tier, TraseuCard } from "@/data/cards";

export type Level = "incepator" | "avansat";

export interface Player {
  id: string;
  name: string;
  level: Level;
  color: string;
  points: number;
  won: string[];
  hand: string[];
  handicaps: string[];
  skipNext: boolean;
  setBonus: Tier[];
}

export type Phase =
  | { type: "start" }
  | { type: "skipped" }
  | { type: "drawn"; cardId: string; source: "deck" | "discard" }
  | { type: "choose"; options: string[] }
  | { type: "over"; winnerId: string };

export interface Settings {
  target: number;
  kinds: Record<CardKind, boolean>;
}

export interface GameState {
  players: Player[];
  current: number;
  deck: string[];
  discard: string[];
  phase: Phase;
  settings: Settings;
  turn: number;
  log: { t: number; text: string }[];
  lastEvent?: string;
}

export const PLAYER_COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#a855f7", "#ec4899", "#14b8a6", "#64748b"];

export const DEFAULT_SETTINGS: Settings = {
  target: 12,
  kinds: { traseu: true, proba: true, duel: true, handicap: true, echipament: true },
};

export const SET_BONUS = 2;
export const COURAGE_BONUS = 1;
export const DEATH_ZONE = 2; // ultimele 2 puncte până la vârf

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildDeck(settings: Settings, playerCount: number): string[] {
  return shuffle(
    ALL_CARDS.filter((c) => settings.kinds[c.kind])
      // duelurile nu au sens la un singur jucător
      .filter(
        (c) =>
          !(
            playerCount < 2 &&
            (c.kind === "duel" || (c.kind === "echipament" && ["steal", "pass_handicap", "storm"].includes(c.effect)))
          )
      )
      .map((c) => c.id)
  );
}

export function newGame(players: { name: string; level: Level }[], settings: Settings): GameState {
  const ordered = shuffle(players);
  return {
    players: ordered.map((p, i) => ({
      id: `p${i}-${Date.now().toString(36)}`,
      name: p.name.trim() || `Jucător ${i + 1}`,
      level: p.level,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      points: 0,
      won: [],
      hand: [],
      handicaps: [],
      skipNext: false,
      setBonus: [],
    })),
    current: 0,
    deck: buildDeck(settings, players.length),
    discard: [],
    phase: { type: "start" },
    settings,
    turn: 1,
    log: [{ t: 1, text: `Expediția începe! Ordinea a fost trasă la sorți: ${ordered.map((p) => p.name).join(", ")}.` }],
  };
}

export const inDeathZone = (p: Player, s: Settings) => p.points >= s.target - DEATH_ZONE;

export type Action =
  | { type: "draw" }
  | { type: "success" }
  | { type: "fail" }
  | { type: "duel"; winnerId: string; opponentId: string }
  | { type: "accept_handicap" }
  | { type: "stash" }
  | { type: "continue_skip" }
  | { type: "choose"; cardId: string }
  | { type: "use"; playerId: string; cardId: string; targetId?: string; handicapId?: string }
  | { type: "load"; state: GameState };

function drawOne(s: GameState): { s: GameState; id: string | null } {
  let deck = [...s.deck];
  let discard = [...s.discard];
  let lastEvent = s.lastEvent;
  if (deck.length === 0) {
    if (discard.length === 0) return { s, id: null };
    deck = shuffle(discard);
    discard = [];
    lastEvent = "Pachetul s-a terminat, am amestecat teancul de decartare.";
  }
  const id = deck.shift()!;
  return { s: { ...s, deck, discard, lastEvent }, id };
}

function log(s: GameState, text: string): GameState {
  return { ...s, log: [{ t: s.turn, text }, ...s.log].slice(0, 200), lastEvent: text };
}

function updatePlayer(s: GameState, id: string, fn: (p: Player) => Player): GameState {
  return { ...s, players: s.players.map((p) => (p.id === id ? fn(p) : p)) };
}

function nextTurn(s: GameState): GameState {
  const winner = s.players.find((p) => p.points >= s.settings.target);
  if (winner) {
    return log({ ...s, phase: { type: "over", winnerId: winner.id } }, `🏔️ ${winner.name} a ajuns pe vârf cu ${winner.points} puncte!`);
  }
  const current = (s.current + 1) % s.players.length;
  const p = s.players[current];
  return {
    ...s,
    current,
    turn: s.turn + 1,
    phase: p.skipNext ? { type: "skipped" } : { type: "start" },
  };
}

/** Acordă cartea câștigată și bonusurile. */
function award(s: GameState, playerId: string, cardId: string): GameState {
  const card = getCard(cardId);
  let p = s.players.find((x) => x.id === playerId)!;
  let gained = card.points;
  const notes: string[] = [];
  const won = [...p.won, cardId];

  if (card.kind === "traseu") {
    if (p.handicaps.length > 0) {
      gained += COURAGE_BONUS;
      notes.push(`+${COURAGE_BONUS} curaj (cară bolovani)`);
    }
    const tier = (card as TraseuCard).tier;
    const sameTier = won.filter((id) => {
      const c = getCard(id);
      return c.kind === "traseu" && c.tier === tier;
    }).length;
    if (sameTier >= 3 && !p.setBonus.includes(tier)) {
      gained += SET_BONUS;
      notes.push(`+${SET_BONUS} colecție de 3 trasee „${["", "Ușor", "Mediu", "Greu"][tier]}”`);
      p = { ...p, setBonus: [...p.setBonus, tier] };
    }
  }
  p = { ...p, won, points: p.points + gained };
  const next = updatePlayer(s, playerId, () => p);
  return log(
    next,
    `${p.name} a reușit „${card.title}” și urcă +${gained}${notes.length ? ` (${notes.join(", ")})` : ""}. Altitudine: ${p.points}.`
  );
}

export function reducer(state: GameState, action: Action): GameState {
  const s = state;
  const cur = s.players[s.current];

  switch (action.type) {
    case "load":
      return action.state;

    case "draw": {
      if (s.phase.type !== "start") return s;
      const { s: s2, id } = drawOne(s);
      if (!id) return log(s, "Nu mai sunt cărți de tras.");
      return { ...s2, phase: { type: "drawn", cardId: id, source: "deck" } };
    }

    case "continue_skip": {
      if (s.phase.type !== "skipped") return s;
      const s2 = updatePlayer(s, cur.id, (p) => ({ ...p, skipNext: false }));
      return nextTurn(log(s2, `${cur.name} stă în cort și pierde tura.`));
    }

    case "success": {
      if (s.phase.type !== "drawn") return s;
      return nextTurn(award(s, cur.id, s.phase.cardId));
    }

    case "fail": {
      if (s.phase.type !== "drawn") return s;
      const card = getCard(s.phase.cardId);
      let s2: GameState = { ...s, discard: [s.phase.cardId, ...s.discard] };
      if (inDeathZone(cur, s.settings) && cur.points > 0) {
        const shelter = cur.hand.find((id) => {
          const c = getCard(id);
          return c.kind === "echipament" && c.effect === "shelter";
        });
        if (shelter) {
          s2 = updatePlayer(s2, cur.id, (p) => ({ ...p, hand: p.hand.filter((h) => h !== shelter) }));
          s2 = { ...s2, discard: [shelter, ...s2.discard] };
          s2 = log(s2, `${cur.name} a ratat „${card.title}”, dar Cortul l-a ferit de alunecare.`);
        } else {
          s2 = updatePlayer(s2, cur.id, (p) => ({ ...p, points: Math.max(0, p.points - 1) }));
          s2 = log(s2, `${cur.name} a ratat „${card.title}” în Zona morții și alunecă -1.`);
        }
      } else {
        s2 = log(s2, `${cur.name} a ratat „${card.title}”.`);
      }
      return nextTurn(s2);
    }

    case "duel": {
      if (s.phase.type !== "drawn") return s;
      const opp = s.players.find((p) => p.id === action.opponentId);
      const s2 = log(s, `Duel între ${cur.name} și ${opp?.name}.`);
      return nextTurn(award(s2, action.winnerId, s.phase.cardId));
    }

    case "accept_handicap": {
      if (s.phase.type !== "drawn") return s;
      const id = s.phase.cardId;
      const s2 = updatePlayer(s, cur.id, (p) => ({ ...p, handicaps: [...p.handicaps, id] }));
      return nextTurn(log(s2, `${cur.name} pune în spate bolovanul „${getCard(id).title}”.`));
    }

    case "stash": {
      if (s.phase.type !== "drawn") return s;
      const id = s.phase.cardId;
      const s2 = updatePlayer(s, cur.id, (p) => ({ ...p, hand: [...p.hand, id] }));
      return log(
        { ...s2, phase: { type: "start" } },
        `${cur.name} pune „${getCard(id).title}” în rucsac și trage din nou.`
      );
    }

    case "choose": {
      if (s.phase.type !== "choose") return s;
      const rest = s.phase.options.filter((o) => o !== action.cardId);
      return { ...s, discard: [...rest, ...s.discard], phase: { type: "drawn", cardId: action.cardId, source: "deck" } };
    }

    case "use": {
      const owner = s.players.find((p) => p.id === action.playerId);
      if (!owner || !owner.hand.includes(action.cardId)) return s;
      const card = getCard(action.cardId);
      if (card.kind !== "echipament") return s;
      const target = s.players.find((p) => p.id === action.targetId);
      // scoate cartea din rucsac și o pune la decartare
      let s2 = updatePlayer(s, owner.id, (p) => ({ ...p, hand: p.hand.filter((h) => h !== action.cardId) }));
      s2 = { ...s2, discard: [action.cardId, ...s2.discard] };

      switch (card.effect) {
        case "draw_two": {
          if (s.phase.type !== "start" || owner.id !== cur.id) return s;
          const a = drawOne(s2);
          if (!a.id) return s;
          const b = drawOne(a.s);
          const options = [a.id, b.id].filter(Boolean) as string[];
          return log({ ...b.s, phase: { type: "choose", options } }, `${owner.name} folosește Harta și alege dintre 2 cărți.`);
        }
        case "scavenge": {
          if (s.phase.type !== "start" || owner.id !== cur.id) return s;
          const top = s.discard[0];
          if (!top) return s;
          const discard = s2.discard.filter((d) => d !== top);
          return log(
            { ...s2, discard, phase: { type: "drawn", cardId: top, source: "discard" } },
            `${owner.name} folosește Luneta și ia „${getCard(top).title}” din decartare.`
          );
        }
        case "storm": {
          if (!target) return s;
          s2 = updatePlayer(s2, target.id, (p) => ({ ...p, skipNext: true }));
          return log(s2, `${owner.name} trimite Viscolul peste ${target.name}, care pierde următoarea tură.`);
        }
        case "remove_handicap": {
          const h = action.handicapId ?? owner.handicaps[0];
          if (!h) return s;
          s2 = updatePlayer(s2, owner.id, (p) => ({ ...p, handicaps: p.handicaps.filter((x) => x !== h) }));
          s2 = { ...s2, discard: [h, ...s2.discard] };
          return log(s2, `${owner.name} scapă de bolovanul „${getCard(h).title}”.`);
        }
        case "pass_handicap": {
          const h = action.handicapId ?? owner.handicaps[0];
          if (!h || !target) return s;
          s2 = updatePlayer(s2, owner.id, (p) => ({ ...p, handicaps: p.handicaps.filter((x) => x !== h) }));
          s2 = updatePlayer(s2, target.id, (p) => ({ ...p, handicaps: [...p.handicaps, h] }));
          return log(s2, `${owner.name} îi pasează lui ${target.name} bolovanul „${getCard(h).title}”.`);
        }
        case "steal": {
          if (!target || target.hand.length === 0) return s;
          const pick = target.hand[Math.floor(Math.random() * target.hand.length)];
          s2 = updatePlayer(s2, target.id, (p) => ({ ...p, hand: p.hand.filter((x) => x !== pick) }));
          s2 = updatePlayer(s2, owner.id, (p) => ({ ...p, hand: [...p.hand, pick] }));
          return log(s2, `${owner.name} ia „${getCard(pick).title}” din rucsacul lui ${target.name}.`);
        }
        case "shelter":
          return s; // pasiv
        case "honor":
        default:
          return log(s2, `${owner.name} folosește „${card.title}”: ${card.text}`);
      }
    }
  }
  return s;
}

export function canUse(state: GameState, ownerId: string, cardId: string): { ok: boolean; needsTarget?: "player" | "playerWithHand"; needsHandicap?: boolean } {
  const card = getCard(cardId);
  const owner = state.players.find((p) => p.id === ownerId);
  if (!owner || card.kind !== "echipament" || state.phase.type === "over") return { ok: false };
  const isCur = state.players[state.current].id === ownerId;
  switch (card.effect) {
    case "draw_two":
      return { ok: isCur && state.phase.type === "start" && state.deck.length + state.discard.length >= 2 };
    case "scavenge":
      return { ok: isCur && state.phase.type === "start" && state.discard.length > 0 };
    case "storm":
      return { ok: state.players.length > 1, needsTarget: "player" };
    case "remove_handicap":
      return { ok: owner.handicaps.length > 0, needsHandicap: true };
    case "pass_handicap":
      return { ok: owner.handicaps.length > 0 && state.players.length > 1, needsTarget: "player", needsHandicap: true };
    case "steal":
      return { ok: state.players.some((p) => p.id !== ownerId && p.hand.length > 0), needsTarget: "playerWithHand" };
    case "shelter":
      return { ok: false };
    default:
      return { ok: true };
  }
}

const KEY = "pool-journey:joc";
export function saveGame(s: GameState | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignorat */
  }
}
export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}
