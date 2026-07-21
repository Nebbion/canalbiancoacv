import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Archive, CalendarDays, Goal, ListOrdered, Trophy } from "lucide-react";
import { MatchCard } from "@/components/torneo/MatchCard";
import { TREVISAN_DENIS_2026 } from "@/lib/torneo-2026";
import { isFinalPhase, type StandingsRow } from "@/lib/torneo.functions";
import { parseItalianDate } from "@/lib/use-torneo";

const data = TREVISAN_DENIS_2026;

export const Route = createFileRoute("/archivio/tornei/trevisan-26")({
  head: () => ({
    meta: [
      { title: "Archivio Trevisan Denis 2026 — Canalbianco ACV" },
      {
        name: "description",
        content:
          "Archivio statico del 22° Torneo Trevisan Denis 2026: risultati, classifiche, fase finale e marcatori.",
      },
      { property: "og:title", content: "Archivio Trevisan Denis 2026" },
      {
        property: "og:description",
        content:
          "Risultati, classifiche e marcatori della 22° edizione del torneo.",
      },
    ],
  }),
  component: Trevisan26,
});

function Trevisan26() {
  const [filtro, setFiltro] = useState("Tutte");
  const categorie = useMemo(() => ["Tutte", ...data.categorie], []);

  const partite = useMemo(() => {
    const filtered =
      filtro === "Tutte"
        ? data.matches
        : data.matches.filter((m) => m.categoria === filtro);
    return [...filtered].sort(
      (a, b) =>
        parseItalianDate(a.data) - parseItalianDate(b.data) ||
        a.ora.localeCompare(b.ora),
    );
  }, [filtro]);

  const gruppi = useMemo(() => {
    const map = new Map<string, typeof partite>();
    for (const match of partite) {
      const items = map.get(match.data) ?? [];
      items.push(match);
      map.set(match.data, items);
    }
    return [...map.entries()];
  }, [partite]);

  const squadre = useMemo(
    () =>
      new Set(data.matches.flatMap((m) => [m.casa, m.ospite]).filter(Boolean))
        .size,
    [],
  );
  const marcatori = Object.values(data.scorers).reduce(
    (totale, items) => totale + items.length,
    0,
  );
  const faseFinale = data.matches
    .filter((m) => isFinalPhase(m.girone))
    .sort(
      (a, b) =>
        parseItalianDate(a.data) - parseItalianDate(b.data) ||
        a.ora.localeCompare(b.ora),
    );
  const classifiche = Object.entries(data.standings)
    .filter(([key]) => !isFinalPhase(key.split("|")[1] ?? ""))
    .filter(([, rows]) => rows.some((r) => r.pg > 0));
  const scorers = Object.entries(data.scorers);

  return (
    <div className="bg-secondary text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-stadium-grid opacity-25" />
        <div className="absolute inset-0 bg-glow-radial" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/55">
            <Link to="/archivio" className="hover:text-white">
              Archivio
            </Link>
            <span>/</span>
            <Link to="/archivio/tornei" className="hover:text-white">
              Tornei
            </Link>
            <span>/</span>
            <span className="text-primary font-bold">Trevisan 26</span>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/75">
            <Archive size={14} className="text-primary" /> Archivio statico
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-7xl tracking-wide leading-[0.95]">
            <span className="text-primary text-glow">22°</span> TORNEO
            <br />
            "TREVISAN DENIS"
          </h1>
          <p className="mt-4 max-w-3xl text-white/75 text-base md:text-lg">
            Edizione 2026 · 18 maggio - 6 giugno · Campo Sportivo di
            Villamarzana
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Categorie", value: data.categorie.length },
              { label: "Squadre", value: squadre },
              { label: "Partite", value: data.matches.length },
              { label: "Marcatori", value: marcatori },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="font-display text-3xl text-primary">
                  {item.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-white/55">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#risultati"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-glow hover:brightness-110"
            >
              <CalendarDays size={16} /> Risultati
            </a>
            <a
              href="#classifiche"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10"
            >
              <ListOrdered size={16} /> Classifiche
            </a>
            <a
              href="#marcatori"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10"
            >
              <Goal size={16} /> Marcatori
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12 space-y-14">
        {faseFinale.length > 0 && (
          <section>
            <SectionTitle
              icon={<Trophy size={20} />}
              eyebrow="Tabellone"
              title="Fase finale"
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {faseFinale.map((match) => (
                <MatchCard key={match.id} m={match} />
              ))}
            </div>
          </section>
        )}

        <section id="risultati" className="scroll-mt-28">
          <SectionTitle
            icon={<CalendarDays size={20} />}
            eyebrow="Calendario"
            title="Risultati"
          />
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            {categorie.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setFiltro(categoria)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  filtro === categoria
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-white/5 border border-white/15 text-white/80 hover:bg-white/10"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-10">
            {gruppi.map(([giorno, items]) => (
              <section key={giorno}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <div className="font-display text-xl text-primary tracking-wider">
                    {giorno}
                  </div>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((match) => (
                    <MatchCard key={match.id} m={match} compact />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section id="classifiche" className="scroll-mt-28">
          <SectionTitle
            icon={<ListOrdered size={20} />}
            eyebrow="Gironi"
            title="Classifiche"
          />
          {classifiche.length > 0 ? (
            <div className="mt-5 grid gap-8 lg:grid-cols-2">
              {classifiche.map(([key, rows]) => {
                const [categoria, girone] = key.split("|");
                return (
                  <Classifica
                    key={key}
                    categoria={categoria}
                    girone={girone}
                    rows={rows}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState>
              Classifiche non disponibili nello snapshot archiviato.
            </EmptyState>
          )}
          <p className="mt-4 text-xs text-white/45">
            Per la categoria Pulcini lo snapshot non contiene punteggi numerici,
            quindi non viene pubblicata una classifica calcolata.
          </p>
        </section>

        <section id="marcatori" className="scroll-mt-28">
          <SectionTitle
            icon={<Goal size={20} />}
            eyebrow="Statistiche"
            title="Marcatori"
          />
          {scorers.length > 0 ? (
            <div className="mt-5 grid gap-8 lg:grid-cols-3">
              {scorers.map(([categoria, items]) => (
                <section
                  key={categoria}
                  className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                >
                  <header className="bg-secondary border-b border-white/10 px-5 py-3 flex items-center gap-2">
                    <Goal className="text-primary" size={18} />
                    <div className="font-display text-xl tracking-wide">
                      {categoria}
                    </div>
                  </header>
                  <ul className="divide-y divide-white/5">
                    {items.map((scorer, index) => (
                      <li
                        key={`${scorer.nome}-${scorer.squadra}`}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <span className="font-display text-lg text-white/40 w-6 text-center">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">
                            {scorer.nome}
                          </div>
                          <div className="text-xs text-white/60 truncate">
                            {scorer.squadra}
                          </div>
                        </div>
                        <div className="font-display text-2xl text-primary">
                          {scorer.gol}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <EmptyState>
              Marcatori non disponibili nello snapshot archiviato.
            </EmptyState>
          )}
        </section>
      </main>
    </div>
  );
}

function SectionTitle({
  icon,
  eyebrow,
  title,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
          {icon} {eyebrow}
        </div>
        <h2 className="mt-2 font-display text-3xl md:text-5xl tracking-wide">
          {title}
        </h2>
      </div>
    </div>
  );
}

function Classifica({
  categoria,
  girone,
  rows,
}: {
  categoria: string;
  girone: string;
  rows: StandingsRow[];
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <header className="bg-secondary border-b border-white/10 px-5 py-3">
        <div className="text-[10px] uppercase tracking-widest text-white/60">
          Classifica
        </div>
        <div className="font-display text-xl tracking-wide">
          {categoria} <span className="text-primary">· Girone {girone}</span>
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
            {rows.map((row, index) => (
              <tr
                key={row.squadra}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="py-2 px-3 text-white/60">{index + 1}</td>
                <td className="py-2 px-3 font-semibold">{row.squadra}</td>
                <td className="py-2 px-2 text-center text-white/70">
                  {row.pg}
                </td>
                <td className="py-2 px-2 text-center text-white/70">{row.v}</td>
                <td className="py-2 px-2 text-center text-white/70">{row.n}</td>
                <td className="py-2 px-2 text-center text-white/70">{row.p}</td>
                <td className="py-2 px-2 text-center text-white/70">
                  {row.gf}
                </td>
                <td className="py-2 px-2 text-center text-white/70">
                  {row.gs}
                </td>
                <td className="py-2 px-2 text-center text-white/70">
                  {row.dr > 0 ? `+${row.dr}` : row.dr}
                </td>
                <td className="py-2 px-3 text-right font-display text-lg text-primary">
                  {row.pti}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-white/15 p-8 text-center text-white/60">
      {children}
    </div>
  );
}
