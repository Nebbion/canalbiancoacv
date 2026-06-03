import { createFileRoute } from "@tanstack/react-router";
import { useTorneoData } from "@/lib/use-torneo";
import { useState } from "react";

export const Route = createFileRoute("/torneo/classifiche")({
  component: Classifiche,
});

// ─── Mappatura loghi squadre ─────────────────────────────────────────────────
// Metti i PNG in /public/loghi/ e aggiungi qui nome squadra → file
function TeamLogo({ nome, size = "sm" }: { nome: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-[10px]";
  const exts = ["png", "jpg", "jpeg"];
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`${dim} rounded-full bg-white/10 flex items-center justify-center font-bold text-white/60 flex-shrink-0`}>
        {iniziali(nome)}
      </div>
    );
  }

  return (
    <img
      src={`/loghi/${nome}.${exts[extIdx]}`}
      alt={nome}
      className={`${dim} rounded-full object-contain bg-white/10 flex-shrink-0`}
      onError={() => {
        if (extIdx + 1 < exts.length) setExtIdx(extIdx + 1);
        else setFailed(true);
      }}
    />
  );
}

// Girone speciali (esclusi da classifica, mostrati diversamente)
const GIRONI_SPECIALI = ["semifinale", "finale"];

function isSpeciale(girone: string) {
  return GIRONI_SPECIALI.includes(girone.toLowerCase());
}

// Iniziali per fallback avatar
function iniziali(nome: string) {
  return nome
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function TeamLogo({ nome, size = "sm" }: { nome: string; size?: "sm" | "md" }) {
  const src = LOGHI[nome];
  const dim = size === "sm" ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-[10px]";

  if (src) {
    return (
      <img
        src={src}
        alt={nome}
        className={`${dim} rounded-full object-contain bg-white/10 flex-shrink-0`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full bg-white/10 flex items-center justify-center font-bold text-white/60 flex-shrink-0`}
    >
      {iniziali(nome)}
    </div>
  );
}

function ClassificaGirone({
  categoria,
  girone,
  rows,
}: {
  categoria: string;
  girone: string;
  rows: { squadra: string; pg: number; v: number; n: number; p: number; gf: number; gs: number; dr: number; pti: number }[];
}) {
  const label = isSpeciale(girone) ? girone : `Girone ${girone}`;

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <header className="bg-secondary border-b border-white/10 px-5 py-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/60">Classifica</div>
          <div className="font-display text-xl tracking-wide">
            {categoria}{" "}
            <span className="text-primary">· {label}</span>
          </div>
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
                <td className="py-2 px-3 font-semibold">
                  <div className="flex items-center gap-2">
                    <TeamLogo nome={r.squadra} size="sm" />
                    <span>{r.squadra}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-center text-white/70">{r.pg}</td>
                <td className="py-2 px-2 text-center text-white/70">{r.v}</td>
                <td className="py-2 px-2 text-center text-white/70">{r.n}</td>
                <td className="py-2 px-2 text-center text-white/70">{r.p}</td>
                <td className="py-2 px-2 text-center text-white/70">{r.gf}</td>
                <td className="py-2 px-2 text-center text-white/70">{r.gs}</td>
                <td className="py-2 px-2 text-center text-white/70">
                  {r.dr > 0 ? `+${r.dr}` : r.dr}
                </td>
                <td className="py-2 px-3 text-right font-display text-lg text-primary">{r.pti}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MatchSpeciale({
  categoria,
  girone,
  rows,
}: {
  categoria: string;
  girone: string;
  rows: { squadra: string; pg: number; v: number; n: number; p: number; gf: number; gs: number; dr: number; pti: number }[];
}) {
  const isFinale = girone.toLowerCase() === "finale";
  const accentColor = isFinale ? "from-amber-500/20 to-amber-600/5 border-amber-500/30" : "from-blue-500/10 to-blue-600/5 border-blue-400/20";
  const badgeColor = isFinale ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-blue-500/15 text-blue-300 border-blue-400/25";
  const icon = isFinale ? "🏆" : "⚔️";

  if (rows.length < 2) return null;

  // Mostra le squadre come sfidanti (non classifica)
  const [prima, seconda] = rows;

  return (
    <section
      className={`rounded-xl border bg-gradient-to-br ${accentColor} overflow-hidden`}
    >
      <header className="px-5 py-3 flex items-center gap-3 border-b border-white/10">
        <span className="text-xl">{icon}</span>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/50">
            {categoria}
          </div>
          <div className="font-display text-xl tracking-wide text-white">
            {girone}
          </div>
        </div>
        <span
          className={`ml-auto text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${badgeColor}`}
        >
          {isFinale ? "Finale" : "Semifinale"}
        </span>
      </header>

      <div className="px-5 py-4 flex flex-col gap-2">
        {rows.map((r, i) => (
          <div
            key={r.squadra}
            className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-2.5"
          >
            <span className="text-white/40 text-sm w-4">{i + 1}</span>
            <TeamLogo nome={r.squadra} size="md" />
            <span className="font-semibold text-sm flex-1">{r.squadra}</span>
            <span className="font-display text-base text-primary">{r.pti} pt</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Classifiche() {
  const { data, isLoading } = useTorneoData();

  // Filtro case-insensitive — funziona qualunque cosa arrivi dal foglio
  const entries = Object.entries(data?.standings ?? {});
  const gironiNormali = entries.filter(
    ([key]) => !isSpeciale(key.split("|")[1] ?? "")
  );
  const gironiSpeciali = entries.filter(([key]) =>
    isSpeciale(key.split("|")[1] ?? "")
  );

  const tuttiVuoti = entries.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12 space-y-10">
      {isLoading && <div className="text-white/60">Caricamento…</div>}

      {!isLoading && tuttiVuoti && (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/60">
          Le classifiche si genereranno automaticamente al termine delle prime partite.
        </div>
      )}

      {/* Classifiche gironi normali */}
      {gironiNormali.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-2">
          {gironiNormali.map(([key, rows]) => {
            const [categoria, girone] = key.split("|");
            return (
              <ClassificaGirone
                key={key}
                categoria={categoria}
                girone={girone}
                rows={rows}
              />
            );
          })}
        </div>
      )}

      {/* Semifinali e Finali — sezione separata */}
      {gironiSpeciali.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-[3px] text-white/40">
              Fase finale
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gironiSpeciali.map(([key, rows]) => {
              const [categoria, girone] = key.split("|");
              return (
                <MatchSpeciale
                  key={key}
                  categoria={categoria}
                  girone={girone}
                  rows={rows}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}