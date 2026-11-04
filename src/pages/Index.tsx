import { Link } from "react-router-dom";
import { Users, User, BookOpen, Layers } from "lucide-react";
import { Layout } from "@/components/Layout";
import { buttonVariants } from "@/components/ui/button";
import { CardFace } from "@/components/game/CardFace";
import { getCard } from "@/data/cards";
import { MountainTrack } from "@/components/game/MountainTrack";

const demoPlayers = [
  { id: "a", name: "Ana", color: "#ef4444", points: 3 },
  { id: "b", name: "Bogdan", color: "#3b82f6", points: 7 },
  { id: "c", name: "Cristi", color: "#f59e0b", points: 10 },
].map((p) => ({ ...p, level: "incepator" as const, won: [], hand: [], handicaps: [], skipNext: false, setBonus: [] }));

export default function Index() {
  return (
    <Layout>
      <section className="grid items-center gap-10 py-6 lg:grid-cols-2">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-accent">Joc de cărți pentru biliard</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight sm:text-5xl">
            Urcă pe munte, <span className="text-primary">o bilă pe rând.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Tragi o carte, o joci la masa reală și apeși <strong>Reușit</strong> sau <strong>Ratat</strong>. Aplicația ține scorul,
            pachetul, rucsacurile cu echipament și bolovanii fiecăruia. Primul care ajunge pe vârf câștigă.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/joc" className={buttonVariants({ size: "lg" })}><Users /> Joc în grup (1–8)</Link>
            <Link to="/antrenament" className={buttonVariants({ size: "lg", variant: "accent" })}><User /> Antrenament solo</Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link to="/reguli" className={buttonVariants({ variant: "ghost" })}><BookOpen /> Cum se joacă</Link>
            <Link to="/carti" className={buttonVariants({ variant: "ghost" })}><Layers /> Toate cărțile</Link>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border shadow-lg">
            <MountainTrack players={demoPlayers} target={12} currentId="b" />
          </div>
          <div className="pointer-events-none absolute -bottom-10 -left-4 hidden w-56 rotate-[-6deg] sm:block">
            <CardFace card={getCard("T4-2")} compact />
          </div>
          <div className="pointer-events-none absolute -bottom-12 right-0 hidden w-52 rotate-[5deg] sm:block">
            <CardFace card={getCard("E4")} compact />
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Trasee", "Schemă de bile pe masă, în 3 grade de dificultate. +1, +2 sau +3 puncte.", "#16a34a"],
          ["Probe", "Teste de tehnică: frână, retragere, dublu, combinații, siguranțe.", "#0e7490"],
          ["Dueluri", "Te lupți direct cu un adversar. Câștigătorul ia cartea.", "#be123c"],
          ["Bolovani", "Handicapuri permanente. Dar fiecare traseu reușit cu ei îți dă +1 curaj.", "#57534e"],
          ["Echipament", "Cărți păstrate în rucsac: viscol, hartă, cort, piolet și altele.", "#ca8a04"],
        ].map(([t, d, c]) => (
          <div key={t} className="rounded-xl border bg-card p-4" style={{ borderTop: `4px solid ${c}` }}>
            <h3 className="font-bold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
