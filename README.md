# Pool Journey

Joc de cărți digital pentru biliard, făcut pentru HTM Pool School. Se joacă la o masă reală: tragi o carte în aplicație, execuți provocarea la masă și apeși **Reușit** sau **Ratat**. Aplicația ține pachetul, scorul, rucsacurile cu echipament, bolovanii (handicapurile) și jurnalul jocului.

## Moduri de joc
- **Joc în grup** (1–8 jucători): primul care ajunge pe vârf (implicit 12 puncte) câștigă.
- **Antrenament solo**: „Cele 3 runde” (3 × 5 cărți) și „Escalada” (trasee din ce în ce mai grele), cu record salvat în browser.

## Pachetul (73 de cărți)
- 30 de **Trasee** (10 scheme × 3 niveluri: Ușor +1, Mediu +2, Greu +3)
- 16 **Probe** de tehnică
- 6 **Dueluri**
- 8 **Bolovani** (handicapuri permanente, compensate cu bonus de curaj)
- 13 cărți de **Echipament**

Datele cărților sunt în `src/data/cards.ts`, iar regulile jocului în `src/game/engine.ts`.

## Tehnologii
Vite + React 18 + TypeScript + Tailwind CSS (structura standard Lovable, componente în stil shadcn/ui). Nu are nevoie de backend; jocul în curs se salvează în `localStorage`.

## Rulare locală
```sh
npm install
npm run dev
```

## Import în Lovable
Lovable nu se conectează la un repository GitHub existent; proiectul se importă ca ZIP:
1. Pe GitHub, în repository: **Code → Download ZIP** (sau folosește direct arhiva primită).
2. În Lovable, pe dashboard: butonul **+** din caseta de prompt → **Import project to Lovable** → **Upload code**.
3. **Upload the ZIP**, aștepți „Ready to import” și apeși **Start import**.
4. Dacă vrei sincronizare cu GitHub după import: în proiectul Lovable activezi **Git sync** (Lovable creează un repository nou).
