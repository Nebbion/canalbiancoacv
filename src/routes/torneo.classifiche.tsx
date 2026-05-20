import { createFileRoute } from "@tanstack/react-router";
import { useTorneoData } from "@/lib/use-torneo";

export const Route = createFileRoute("/torneo/classifiche")({
  component: Classifiche,
});

function Classifiche() {
  const { data, isLoading } = useTorneoData();
  const entries = Object.entries(data?.standings ?? {});

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
      {isLoading && <div className="text-white/60">Caricamento…</div>}
      {!isLoading && entries.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/60">
          Le classifiche si genereranno automaticamente al termine delle prime partite.
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-2">
        {entries.map(([key, rows]) => {
          const [categoria, girone] = key.split("|");
          return (
            <section key={key} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <header className="bg-secondary border-b border-white/10 px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/60">Classifica</div>
                  <div className="font-display text-xl tracking-wide">{categoria} <span className="text-primary">· Girone {girone}</span></div>
                </div>
              </header>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-[10px] uppercase tracking-widest text-white/60">
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-3 w-8">#</th>
                      <th className="text-left py-2 px-3">Squadra</th>
                      <th className="py-2 px-2">PG</th>
                      <th className="py-2 px-2">V</th>
                      <th className="py-2 px-2">N</th>
                      <th className="py-2 px-2">P</th>
                      <th className="py-2 px-2">GF</th>
                      <th className="py-2 px-2">GS</th>
                      <th className="py-2 px-2">DR</th>
                      <th className="py-2 px-3 text-right">PTI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.squadra} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3 text-white/60">{i + 1}</td>
                        <td className="py-2 px-3 font-semibold">{r.squadra}</td>
                        <td className="py-2 px-2 text-center text-white/70">{r.pg}</td>
                        <td className="py-2 px-2 text-center text-white/70">{r.v}</td>
                        <td className="py-2 px-2 text-center text-white/70">{r.n}</td>
                        <td className="py-2 px-2 text-center text-white/70">{r.p}</td>
                        <td className="py-2 px-2 text-center text-white/70">{r.gf}</td>
                        <td className="py-2 px-2 text-center text-white/70">{r.gs}</td>
                        <td className="py-2 px-2 text-center text-white/70">{r.dr > 0 ? `+${r.dr}` : r.dr}</td>
                        <td className="py-2 px-3 text-right font-display text-lg text-primary">{r.pti}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
