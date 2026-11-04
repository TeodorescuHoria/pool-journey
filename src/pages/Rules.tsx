import { Layout } from "@/components/Layout";
import { COURAGE_BONUS, DEATH_ZONE, DEFAULT_SETTINGS, SET_BONUS } from "@/game/engine";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-xl border bg-card p-5">
    <h2 className="text-xl font-extrabold">{title}</h2>
    <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-foreground/90">{children}</div>
  </section>
);

export default function Rules() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-3xl font-extrabold">Regulile Pool Journey</h1>
        <p className="text-muted-foreground">
          Pool Journey este un joc de cărți care se joacă la o masă de biliard reală. Aplicația ține pachetul, scorul și efectele;
          voi jucați loviturile și spuneți cinstit dacă ați reușit.
        </p>

        <Section title="Scopul">
          <p>
            Fiecare carte reușită te urcă pe munte cu un număr de puncte de altitudine. Primul jucător care ajunge pe vârf
            (implicit {DEFAULT_SETTINGS.target} puncte, reglabil între 6 și 20) câștigă.
          </p>
        </Section>

        <Section title="Pregătirea">
          <ul className="list-disc space-y-1 pl-5">
            <li>Adăugați 1–8 jucători și alegeți nivelul fiecăruia: <strong>Începător</strong> sau <strong>Avansat</strong>.</li>
            <li>Ordinea la masă se trage la sorți automat.</li>
            <li>Puteți scoate din pachet tipurile de cărți pe care nu le vreți (de exemplu Bolovanii pentru copii).</li>
          </ul>
        </Section>

        <Section title="Tura ta">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Dacă vrei, folosește echipament pentru începutul turei (Harta sau Luneta).</li>
            <li>Apasă <strong>Trage o carte</strong>.</li>
            <li>Joacă provocarea la masă, apoi apasă <strong>Reușit</strong> sau <strong>Ratat</strong>.</li>
            <li>Cartea reușită rămâne a ta, cea ratată merge la decartare. Tura trece la următorul jucător.</li>
          </ol>
        </Section>

        <Section title="Tipurile de cărți">
          <p><strong className="text-green-700">Traseu (Ușor +1 · Mediu +2 · Greu +3).</strong> Așază bilele ca în schemă, cu alba din mână, și bagă-le pe toate fără nicio ratare. Avansații trebuie să bage neagra (8) ultima; începătorii o pot băga oricând.</p>
          <p><strong className="text-cyan-700">Probă (+1 până la +3).</strong> Un test de tehnică. Ai o singură încercare.</p>
          <p><strong className="text-rose-700">Duel (+2).</strong> Alegi un adversar și jucați după textul cărții. Câștigătorul ia cartea și punctele, chiar dacă nu e la rând.</p>
          <p><strong className="text-stone-700">Bolovan (0).</strong> Un handicap permanent care rămâne cu tine. Tura se termină când îl primești. Compensare: cât timp cari cel puțin un bolovan, fiecare traseu reușit îți dă +{COURAGE_BONUS} curaj.</p>
          <p><strong className="text-amber-700">Echipament (0).</strong> Îl pui în rucsac și tragi imediat altă carte. Îl folosești mai târziu, la momentul scris pe carte, chiar și în tura altcuiva (de exemplu Viscolul).</p>
        </Section>

        <Section title="Bonusuri și pericole">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Colecția:</strong> când ai câștigat 3 trasee de același nivel, primești o dată +{SET_BONUS} puncte pentru acel nivel.</li>
            <li><strong>Curajul:</strong> +{COURAGE_BONUS} la fiecare traseu reușit cât timp cari bolovani.</li>
            <li><strong>Zona morții:</strong> în ultimele {DEATH_ZONE} puncte până la vârf, orice traseu sau probă ratată te face să aluneci -1. Cortul te protejează o dată.</li>
            <li>Când pachetul se termină, decartarea se amestecă și devine pachet nou.</li>
          </ul>
        </Section>

        <Section title="Antrenament solo">
          <p><strong>Cele 3 runde:</strong> 3 runde a câte 5 cărți (trasee și probe). Scorul e suma punctelor cărților reușite.</p>
          <p><strong>Escalada:</strong> doar trasee. Pornești de la Ușor; după 2 reușite la rând urci un nivel. La a treia ratare, se termină.</p>
        </Section>

        <Section title="Sfaturi pentru școală">
          <ul className="list-disc space-y-1 pl-5">
            <li>Pe tabletă sau telefon lângă masă, jocul se salvează automat; puteți închide pagina și continua.</li>
            <li>Instructorul poate juca rolul de arbitru la Probe și Dueluri.</li>
            <li>Pentru grupuri mari, scădeți vârful la 8 puncte.</li>
          </ul>
        </Section>
      </div>
    </Layout>
  );
}
