// Pachetul de cărți al jocului „Pool Journey”.
// Toate numele, textele și traseele sunt originale.

export type CardKind = "traseu" | "proba" | "duel" | "handicap" | "echipament";
export type Tier = 1 | 2 | 3;

export interface Pt {
  x: number; // 0..2 (lungimea mesei)
  y: number; // 0..1 (lățimea mesei)
}

export type EffectId =
  | "draw_two"
  | "scavenge"
  | "storm"
  | "remove_handicap"
  | "pass_handicap"
  | "steal"
  | "shelter"
  | "honor";

interface BaseCard {
  id: string;
  kind: CardKind;
  title: string;
  text: string;
  points: number;
}

export interface TraseuCard extends BaseCard {
  kind: "traseu";
  tier: Tier;
  route: string;
  balls: Pt[];
  eight: Pt;
}
export interface ProbaCard extends BaseCard {
  kind: "proba";
}
export interface DuelCard extends BaseCard {
  kind: "duel";
}
export interface HandicapCard extends BaseCard {
  kind: "handicap";
  shotClock?: number;
}
export interface EchipamentCard extends BaseCard {
  kind: "echipament";
  effect: EffectId;
  when: string;
}

export type GameCard = TraseuCard | ProbaCard | DuelCard | HandicapCard | EchipamentCard;

export const TIER_LABEL: Record<Tier, string> = { 1: "Ușor", 2: "Mediu", 3: "Greu" };
export const TIER_ROMAN: Record<Tier, string> = { 1: "I", 2: "II", 3: "III" };

export const KIND_LABEL: Record<CardKind, string> = {
  traseu: "Traseu",
  proba: "Probă",
  duel: "Duel",
  handicap: "Bolovan",
  echipament: "Echipament",
};

// ---------- TRASEE ----------
// Fiecare traseu are 5 poziții. Ușor = primele 3, Mediu = primele 4, Greu = toate 5.
const ROUTES: { name: string; balls: Pt[]; eight: [Pt, Pt, Pt] }[] = [
  {
    name: "Scara",
    balls: [
      { x: 0.35, y: 0.75 },
      { x: 0.55, y: 0.6 },
      { x: 0.75, y: 0.45 },
      { x: 0.95, y: 0.3 },
      { x: 1.15, y: 0.18 },
    ],
    eight: [{ x: 1.5, y: 0.5 }, { x: 1.6, y: 0.65 }, { x: 1.7, y: 0.8 }],
  },
  {
    name: "Fermoarul",
    balls: [
      { x: 0.45, y: 0.08 },
      { x: 1.55, y: 0.08 },
      { x: 0.75, y: 0.08 },
      { x: 1.3, y: 0.08 },
      { x: 1.82, y: 0.08 },
    ],
    eight: [{ x: 1.0, y: 0.8 }, { x: 0.3, y: 0.85 }, { x: 1.0, y: 0.08 }],
  },
  {
    name: "Colțul liniștit",
    balls: [
      { x: 1.78, y: 0.82 },
      { x: 1.72, y: 0.7 },
      { x: 1.86, y: 0.68 },
      { x: 1.62, y: 0.86 },
      { x: 1.66, y: 0.6 },
    ],
    eight: [{ x: 0.5, y: 0.35 }, { x: 1.2, y: 0.25 }, { x: 1.85, y: 0.5 }],
  },
  {
    name: "Șarpele",
    balls: [
      { x: 0.4, y: 0.3 },
      { x: 0.7, y: 0.7 },
      { x: 1.0, y: 0.35 },
      { x: 1.3, y: 0.7 },
      { x: 1.6, y: 0.3 },
    ],
    eight: [{ x: 1.8, y: 0.55 }, { x: 1.85, y: 0.75 }, { x: 0.15, y: 0.5 }],
  },
  {
    name: "Busola",
    balls: [
      { x: 1.0, y: 0.25 },
      { x: 1.0, y: 0.75 },
      { x: 0.75, y: 0.5 },
      { x: 1.25, y: 0.5 },
      { x: 1.0, y: 0.5 },
    ],
    eight: [{ x: 0.45, y: 0.5 }, { x: 1.55, y: 0.5 }, { x: 1.35, y: 0.2 }],
  },
  {
    name: "Podul",
    balls: [
      { x: 1.5, y: 0.15 },
      { x: 1.5, y: 0.85 },
      { x: 1.5, y: 0.38 },
      { x: 1.5, y: 0.62 },
      { x: 1.5, y: 0.5 },
    ],
    eight: [{ x: 1.78, y: 0.5 }, { x: 1.25, y: 0.5 }, { x: 0.6, y: 0.5 }],
  },
  {
    name: "Valul",
    balls: [
      { x: 0.85, y: 0.14 },
      { x: 1.15, y: 0.86 },
      { x: 1.15, y: 0.14 },
      { x: 0.85, y: 0.86 },
      { x: 1.0, y: 0.3 },
    ],
    eight: [{ x: 1.0, y: 0.7 }, { x: 0.4, y: 0.2 }, { x: 1.0, y: 0.5 }],
  },
  {
    name: "Vârful de săgeată",
    balls: [
      { x: 1.45, y: 0.5 },
      { x: 1.56, y: 0.43 },
      { x: 1.56, y: 0.57 },
      { x: 1.67, y: 0.36 },
      { x: 1.67, y: 0.64 },
    ],
    eight: [{ x: 1.78, y: 0.5 }, { x: 1.67, y: 0.5 }, { x: 1.56, y: 0.5 }],
  },
  {
    name: "Ceasul",
    balls: [
      { x: 0.25, y: 0.1 },
      { x: 0.1, y: 0.5 },
      { x: 1.75, y: 0.9 },
      { x: 0.25, y: 0.9 },
      { x: 1.9, y: 0.5 },
    ],
    eight: [{ x: 1.0, y: 0.5 }, { x: 1.75, y: 0.1 }, { x: 1.0, y: 0.12 }],
  },
  {
    name: "Insulele",
    balls: [
      { x: 0.5, y: 0.5 },
      { x: 1.5, y: 0.5 },
      { x: 0.56, y: 0.42 },
      { x: 1.44, y: 0.58 },
      { x: 1.0, y: 0.5 },
    ],
    eight: [{ x: 1.0, y: 0.22 }, { x: 1.0, y: 0.78 }, { x: 1.85, y: 0.15 }],
  },
];

const traseuCards: TraseuCard[] = ROUTES.flatMap((r, ri) =>
  ([1, 2, 3] as Tier[]).map((tier) => ({
    id: `T${ri + 1}-${tier}`,
    kind: "traseu" as const,
    tier,
    route: r.name,
    title: `${r.name} ${TIER_ROMAN[tier]}`,
    text: "Așază bilele ca în schemă. Alba din mână. Bagă toate bilele fără nicio ratare.",
    points: tier,
    balls: r.balls.slice(0, tier + 2),
    eight: r.eight[tier - 1],
  }))
);

// ---------- PROBE ----------
const probaDefs: [string, string, number][] = [
  ["Frâna de mână", "Bagă o bilă dreaptă de la cel puțin jumătate de masă, iar alba trebuie să rămână pe loc (maxim o lățime de bilă).", 1],
  ["Marșarierul", "Bagă o bilă și retrage alba până dincolo de linia de start a mesei.", 2],
  ["Pendulul", "Trimite alba până la mantinela de sus și înapoi. Trebuie să se oprească la cel mult o palmă de mantinela de start.", 2],
  ["Ocolul prin mantinelă", "Alba lovește întâi o mantinelă, apoi bila țintă, care trebuie să intre în orice buzunar.", 3],
  ["Lanțul", "Bagă o bilă prin combinație: alba lovește bila A, bila A lovește bila B, iar B intră.", 2],
  ["Trei în același buzunar", "Așază 3 bile cum vrei. Bagă-le pe toate, la rând, în același buzunar de colț (alba din mână doar la prima).", 3],
  ["Lipită de mantinelă", "Bagă o bilă lipită de mantinela lungă într-un buzunar de colț, de la cel puțin un metru distanță.", 2],
  ["Firul de păr", "Bagă o bilă cu o tăietură foarte fină (unghi mai mare de 60 de grade).", 2],
  ["Ținta cu cretă", "Pune creta pe masă. Bagă o bilă și oprește alba la cel mult o palmă de cretă.", 3],
  ["Spargerea mică", "Așază 6 bile în triunghi, sparge și bagă cel puțin o bilă fără ca alba să cadă.", 1],
  ["Patru din cinci", "Așază 4 bile oriunde. Bagă-le pe toate din cel mult 5 lovituri (alba din mână doar la prima).", 2],
  ["Dublul", "Bagă o bilă cu dublu: bila țintă atinge o mantinelă înainte să intre în buzunar.", 2],
  ["Ricoșeul", "Alba atinge întâi o bilă ajutătoare, apoi ricoșează în bila țintă, care trebuie să intre.", 3],
  ["Zidul", "Joacă o lovitură de siguranță: după lovitură, nicio bilă țintă nu are cale directă spre un buzunar din poziția albei. Arbitrează adversarul.", 2],
  ["Linia de mijloc", "Așază 5 bile pe linia de mijloc a mesei, la distanțe egale. Bagă-le pe toate fără ratare.", 3],
  ["Turul mesei", "Bagă o bilă, iar alba trebuie să atingă cel puțin două mantinele și să se oprească în jumătatea opusă a mesei.", 2],
];
const probaCards: ProbaCard[] = probaDefs.map(([title, text, points], i) => ({
  id: `P${i + 1}`,
  kind: "proba",
  title,
  text,
  points,
}));

// ---------- DUELURI ----------
const duelDefs: [string, string][] = [
  ["Literele T-A-C", "Alegi un adversar. Cine e la masă anunță și execută o lovitură; dacă reușește, celălalt trebuie să o copieze. Fiecare copiere ratată aduce o literă. Primul care strânge T-A-C pierde."],
  ["Cursa contra cronometru", "Amândoi jucați același traseu din 4 bile, pe rând. Câștigă cine termină din mai puține lovituri (egalitate = încă o rundă)."],
  ["Spargerea decisivă", "Fiecare așază 9 bile în romb și sparge o dată. Câștigă cine bagă mai multe bile la spargere (alba căzută = 0)."],
  ["Pendulul dublu", "Trimiteți alba în același timp până la mantinela de sus și înapoi. Câștigă alba oprită mai aproape de mantinela de start."],
  ["Bila singuratică", "Bila neagră în centrul mesei, alba din mână. Jucați pe rând câte o lovitură; primul care o bagă câștigă."],
  ["Șahul pe postav", "Trei bile pe masă. Pe rând, fiecare joacă o lovitură de siguranță. Primul care lasă adversarului o bilă băgată pierde."],
];
const duelCards: DuelCard[] = duelDefs.map(([title, text], i) => ({
  id: `D${i + 1}`,
  kind: "duel",
  title,
  text,
  points: 2,
}));

// ---------- BOLOVANI (handicapuri permanente) ----------
const handicapDefs: [string, string, number?][] = [
  ["Ceasul de nisip", "La toate traseele viitoare ai 30 de secunde pe lovitură. Folosește cronometrul din aplicație.", 30],
  ["Fără efect", "La toate traseele viitoare lovești alba doar pe axa verticală, fără efect lateral."],
  ["Buzunarul impus", "Înainte de fiecare traseu, jucătorul din stânga ta alege buzunarul în care trebuie să intre bila neagră."],
  ["Plecarea de jos", "La toate traseele viitoare, alba din mână se așază doar în spatele liniei de start."],
  ["Fără crosă", "Nu mai ai voie să folosești crosa (podul mecanic) la trasee."],
  ["Planul pe hârtie", "Înainte de fiecare traseu anunți ordinea tuturor bilelor. Dacă o schimbi, traseul e ratat."],
  ["Mantinela obligatorie", "La fiecare lovitură din trasee, alba trebuie să atingă cel puțin o mantinelă după contactul cu bila."],
  ["Bila în plus", "Toate traseele tale viitoare au o bilă în plus, pe care o așază adversarul din dreapta ta."],
];
const handicapCards: HandicapCard[] = handicapDefs.map(([title, text, shotClock], i) => ({
  id: `H${i + 1}`,
  kind: "handicap",
  title,
  text,
  points: 0,
  shotClock,
}));

// ---------- ECHIPAMENT ----------
const echipDefs: [string, string, EffectId, string][] = [
  ["Harta", "Tragi 2 cărți, păstrezi una și o joci, cealaltă merge la decartare.", "draw_two", "La începutul turei tale."],
  ["Harta", "Tragi 2 cărți, păstrezi una și o joci, cealaltă merge la decartare.", "draw_two", "La începutul turei tale."],
  ["Luneta", "În loc să tragi din pachet, iei cartea de deasupra teancului de decartare.", "scavenge", "La începutul turei tale."],
  ["Viscolul", "Alegi un jucător. Acesta își pierde următoarea tură.", "storm", "Oricând."],
  ["Viscolul", "Alegi un jucător. Acesta își pierde următoarea tură.", "storm", "Oricând."],
  ["Rucsacul ușor", "Arunci unul dintre bolovanii tăi.", "remove_handicap", "Oricând."],
  ["Pasează bolovanul", "Muți unul dintre bolovanii tăi la alt jucător.", "pass_handicap", "Oricând."],
  ["Mâna lungă", "Iei un echipament la întâmplare din rucsacul altui jucător.", "steal", "Oricând."],
  ["Cortul", "Te protejează automat o dată de alunecarea din Zona morții.", "shelter", "Se folosește automat."],
  ["Coarda de rezervă", "Primești încă o încercare după prima ratare la cartea curentă.", "honor", "În timpul unui traseu sau al unei probe."],
  ["Pioletul", "Scoți o bilă la alegere din traseul tău.", "honor", "Înainte să începi traseul."],
  ["Busola", "Muți o bilă din traseul tău oriunde pe masă.", "honor", "Înainte să începi traseul."],
  ["Avalanșa", "Adaugi o bilă, așezată de tine, în traseul unui adversar.", "honor", "Înainte ca adversarul să înceapă traseul."],
];
const echipCards: EchipamentCard[] = echipDefs.map(([title, text, effect, when], i) => ({
  id: `E${i + 1}`,
  kind: "echipament",
  title,
  text,
  points: 0,
  effect,
  when,
}));

export const ALL_CARDS: GameCard[] = [
  ...traseuCards,
  ...probaCards,
  ...duelCards,
  ...handicapCards,
  ...echipCards,
];

export const CARD_BY_ID: Record<string, GameCard> = Object.fromEntries(ALL_CARDS.map((c) => [c.id, c]));

export const getCard = (id: string) => CARD_BY_ID[id];
