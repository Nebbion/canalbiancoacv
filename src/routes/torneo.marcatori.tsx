import { createFileRoute } from "@tanstack/react-router";
import { useTorneoData } from "@/lib/use-torneo";
import { Goal } from "lucide-react";

export const Route = createFileRoute("/torneo/marcatori")({
  component: Marcatori,
});

function Marcatori() {
  const { data, isLoading } = useTorneoData();
  const entries = Object.entries(data?.scorers ?? {});

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
      {isLoading && <div className="text-white/60">Caricamento…</div>}
      {!isLoading && entries.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/60">
          Inserisci i marcatori nella colonna "Marcatori" del Google Sheet per popolare automaticamente la classifica.
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-3">
        {entries.map(([categoria, scorers]) => (
          <section key={categoria} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <header className="bg-secondary border-b border-white/10 px-5 py-3 flex items-center gap-2">
              <Goal className="text-primary" size={18} />
              <div className="font-display text-xl tracking-wide">{categoria}</div>
            </header>
            <ul className="divide-y divide-white/5">
              {scorers.slice(0, 15).map((s, i) => (
                <li key={`${s.nome}-${s.squadra}`} className="flex items-center gap-3 px-4 py-3">
                  <span className="font-display text-lg text-white/40 w-6 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{s.nome}</div>
                    <div className="text-xs text-white/60 truncate">{s.squadra}</div>
                  </div>
                  <div className="font-display text-2xl text-primary">{s.gol}</div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
