import { useState } from "react";
import { Layout } from "@/components/Layout";
import { CardFace } from "@/components/game/CardFace";
import { ALL_CARDS, CardKind, KIND_LABEL } from "@/data/cards";
import { cn } from "@/lib/utils";

export default function Cards() {
  const [kind, setKind] = useState<CardKind>("traseu");
  const list = ALL_CARDS.filter((c) => c.kind === kind);
  return (
    <Layout>
      <h1 className="text-3xl font-extrabold">Pachetul de cărți</h1>
      <p className="mt-1 text-muted-foreground">{ALL_CARDS.length} de cărți în total.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(KIND_LABEL) as CardKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium", kind === k ? "border-primary bg-primary text-primary-foreground" : "bg-card")}
          >
            {KIND_LABEL[k]} ({ALL_CARDS.filter((c) => c.kind === k).length})
          </button>
        ))}
      </div>
      <div className="mt-6 grid justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <CardFace key={c.id} card={c} compact className="max-w-none" />
        ))}
      </div>
    </Layout>
  );
}
