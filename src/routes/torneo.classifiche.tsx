import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { hasLiveTorneoSource, useTorneoData } from "@/lib/use-torneo";
import { isFinalPhase, type Match } from "@/lib/torneo.functions";

export const Route = createFileRoute("/torneo/classifiche")({
  component: Classifiche,
});

// ─── Logo squadra ─────────────────────────────────────────────────────────────
function iniziali(nome: string) {
  return nome
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
function TeamLogo({ nome, size = "sm" }: { nome: string; size?: "sm" | "md" }) {
  const exts = ["png", "jpg", "jpeg"];
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const dim = size === "md" ? "w-10 h-10 text-xs" : "w-6 h-6 text-[9px]";
  if (failed)
    return (
      <div
        className={`${dim} rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-bold text-white/50 flex-shrink-0`}
      >
        {iniziali(nome)}
      </div>
    );
  return (
    <img
      src={`/loghi/${nome}.${exts[extIdx]}`}
      alt={nome}
      className={`${dim} rounded-full object-contain bg-white/10 border border-white/15 flex-shrink-0`}
      onError={() => {
        if (extIdx + 1 < exts.length) setExtIdx(extIdx + 1);
        else setFailed(true);
      }}
    />
  );
}

// ─── Classifica girone normale ────────────────────────────────────────────────
function ClassificaGirone({
  categoria,
  girone,
  rows,
}: {
  categoria: string;
  girone: string;
  rows: {
    squadra: string;
    pg: number;
    v: number;
    n: number;
    p: number;
    gf: number;
    gs: number;
    dr: number;
    pti: number;
  }[];
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
            {rows.map((r, i) => (
              <tr
                key={r.squadra}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="py-2 px-3 text-white/60">{i + 1}</td>
                <td className="py-2 px-3 font-semibold">
                  <div className="flex items-center gap-2">
                    <TeamLogo nome={r.squadra} size="sm" />
                    {r.squadra}
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
                <td className="py-2 px-3 text-right font-display text-lg text-primary">
                  {r.pti}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Singola partita nel tabellone ────────────────────────────────────────────
function TabelloneMatch({ m }: { m: Match }) {
  const hasScore = m.golCasa !== null && m.golOspite !== null;
  const isFinale = m.girone.toLowerCase().startsWith("finale");
  const winHome = hasScore && m.golCasa! > m.golOspite!;
  const winAway = hasScore && m.golOspite! > m.golCasa!;

  return (
    <div
      className={`rounded-xl border overflow-hidden ${isFinale ? "border-amber-400/40" : "border-white/10"} bg-white/5`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b border-white/8 ${winHome ? "bg-white/8" : ""}`}
      >
        <TeamLogo nome={m.casa} size="md" />
        <span
          className={`flex-1 min-w-0 font-semibold text-sm leading-tight ${winHome ? "text-white" : "text-white/70"}`}
        >
          {m.casa}
        </span>
        <span
          className={`font-display text-2xl w-8 text-center flex-shrink-0 ${winHome ? "text-white" : "text-white/50"}`}
        >
          {hasScore ? m.golCasa : "–"}
        </span>
      </div>
      <div
        className={`flex items-center gap-3 px-4 py-3 ${winAway ? "bg-white/8" : ""}`}
      >
        <TeamLogo nome={m.ospite} size="md" />
        <span
          className={`flex-1 min-w-0 font-semibold text-sm leading-tight ${winAway ? "text-white" : "text-white/70"}`}
        >
          {m.ospite}
        </span>
        <span
          className={`font-display text-2xl w-8 text-center flex-shrink-0 ${winAway ? "text-white" : "text-white/50"}`}
        >
          {hasScore ? m.golOspite : "–"}
        </span>
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/8 text-[11px] text-white/40">
        <span>
          {m.data} · {m.ora}
        </span>
        <span
          className={`uppercase tracking-widest font-bold ${
            m.stato === "In corso"
              ? "text-primary"
              : m.stato === "Terminata"
                ? "text-white/40"
                : "text-white/30"
          }`}
        >
          {m.stato}
        </span>
      </div>
    </div>
  );
}

// ─── Tabellone per singola categoria ─────────────────────────────────────────
function TabelloneCategoria({
  categoria,
  matches,
}: {
  categoria: string;
  matches: Match[];
}) {
  const semifinali = matches.filter(
    (m) => m.girone.toLowerCase() === "semifinale",
  );
  const finali = matches.filter((m) =>
    m.girone.toLowerCase().startsWith("finale"),
  );
  const isFinale = finali.length > 0;

  return (
    <div
      className={`rounded-xl border overflow-hidden ${isFinale ? "border-amber-400/30" : "border-blue-400/20"}`}
    >
      {/* Header categoria */}
      <div
        className={`px-5 py-3 flex items-center gap-3 border-b border-white/10 ${isFinale ? "bg-amber-500/10" : "bg-blue-500/8"}`}
      >
        <span className="text-lg">{isFinale ? "🏆" : "⚔️"}</span>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/50">
            Fase finale
          </div>
          <div className="font-display text-xl text-white">{categoria}</div>
        </div>
        <span
          className={`ml-auto text-[10px] font-bold uppercase tracking-[2px] px-2.5 py-1 rounded-full border ${
            isFinale
              ? "bg-amber-500/15 text-amber-300 border-amber-400/30"
              : "bg-blue-500/15 text-blue-300 border-blue-400/30"
          }`}
        >
          {isFinale ? "Finale" : "Semifinali"}
        </span>
      </div>

      <div className="p-4 space-y-6">
        {/* Semifinali */}
        {semifinali.length > 0 && (
          <div>
            {finali.length > 0 && (
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
                Semifinali
              </div>
            )}
            <div className="flex flex-col gap-3">
              {semifinali.map((m) => (
                <TabelloneMatch key={m.id} m={m} />
              ))}
            </div>
          </div>
        )}

        {/* Freccia verso finale */}
        {semifinali.length > 0 && finali.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/30 text-xs uppercase tracking-widest">
              Finale
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        )}

        {/* Finale */}
        {finali.length > 0 && (
          <div className="max-w-sm mx-auto">
            {finali.map((m) => (
              <TabelloneMatch key={m.id} m={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────
function Classifiche() {
  const { data, isLoading } = useTorneoData();
  const liveConfigured = hasLiveTorneoSource;

  // Solo gironi normali (A, B…) con almeno una partita giocata
  const gironiNormali = Object.entries(data?.standings ?? {})
    .filter(([key]) => !isFinalPhase(key.split("|")[1] ?? ""))
    .filter(([, rows]) => rows.some((r) => r.pg > 0));

  // Partite di fase finale raggruppate per categoria
  const matchesFinale = (data?.matches ?? []).filter((m) =>
    isFinalPhase(m.girone),
  );
  const categorieFinale = [...new Set(matchesFinale.map((m) => m.categoria))];

  const tuttiVuoti = gironiNormali.length === 0 && categorieFinale.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12 space-y-10">
      {isLoading && <div className="text-white/60">Caricamento…</div>}

      {!isLoading && tuttiVuoti && (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/60">
          {liveConfigured
            ? "Le classifiche si genereranno automaticamente al termine delle prime partite."
            : "Classifiche live in preparazione per la prossima edizione."}
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

      {/* Tabellone fase finale — una card per categoria */}
      {categorieFinale.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-[3px] text-white/40">
              Fase finale
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {categorieFinale.map((cat) => (
              <TabelloneCategoria
                key={cat}
                categoria={cat}
                matches={matchesFinale.filter((m) => m.categoria === cat)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
