import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  hasLiveTorneoSource,
  useTorneoData,
  parseItalianDate,
} from "@/lib/use-torneo";
import { MatchCard } from "@/components/torneo/MatchCard";

export const Route = createFileRoute("/torneo/calendario")({
  component: Calendario,
});

function Calendario() {
  const { data, isLoading } = useTorneoData();
  const [filtro, setFiltro] = useState<string>("Tutte");
  const liveConfigured = hasLiveTorneoSource;

  const categorie = useMemo(
    () => ["Tutte", ...(data?.categorie ?? [])],
    [data],
  );

  const partite = useMemo(() => {
    const all = data?.matches ?? [];
    const f =
      filtro === "Tutte" ? all : all.filter((m) => m.categoria === filtro);
    return [...f].sort(
      (a, b) =>
        parseItalianDate(a.data) - parseItalianDate(b.data) ||
        a.ora.localeCompare(b.ora),
    );
  }, [data, filtro]);

  // Raggruppa per data
  const gruppi = useMemo(() => {
    const map = new Map<string, typeof partite>();
    for (const p of partite) {
      const arr = map.get(p.data) ?? [];
      arr.push(p);
      map.set(p.data, arr);
    }
    return [...map.entries()];
  }, [partite]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {categorie.map((c) => (
          <button
            key={c}
            onClick={() => setFiltro(c)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              filtro === c
                ? "bg-primary text-primary-foreground shadow-glow"
                : "bg-white/5 border border-white/15 text-white/80 hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading && <div className="text-white/60">Caricamento…</div>}

      {gruppi.length === 0 && !isLoading && (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/60">
          {liveConfigured
            ? "Nessuna partita."
            : "Calendario live in preparazione per la prossima edizione."}
        </div>
      )}

      <div className="space-y-10">
        {gruppi.map(([data, items]) => (
          <section key={data}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/10" />
              <div className="font-display text-xl text-primary tracking-wider">
                {data}
              </div>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((m) => (
                <MatchCard key={m.id} m={m} compact />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
