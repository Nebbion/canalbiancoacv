import { useState } from "react";
import type { Match } from "@/lib/torneo.functions";
import { Clock, MapPin } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────
const isSpeciale = (g: string) =>
  ["semifinale", "finale"].includes(g.toLowerCase());

function iniziali(nome: string) {
  return nome
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ─── Logo squadra (png / jpg / jpeg → fallback iniziali) ────────────────────
function TeamLogo({
  nome,
  size = "md",
}: {
  nome: string;
  size?: "sm" | "md" | "lg";
}) {
  const exts = ["png", "jpg", "jpeg"];
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  const dim =
    size === "sm"
      ? "w-6 h-6 text-[9px]"
      : size === "lg"
        ? "w-12 h-12 text-sm"
        : "w-8 h-8 text-[10px]";

  if (failed) {
    return (
      <div
        className={`${dim} rounded-full bg-white/10 flex items-center justify-center font-bold text-white/50 flex-shrink-0`}
      >
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

// ─── Badge stato ────────────────────────────────────────────────────────────
function StatoBadge({ stato }: { stato: Match["stato"] }) {
  const map = {
    "Da giocare": "bg-white/10 text-white/80 border-white/20",
    "In corso": "bg-primary text-primary-foreground border-primary pulse-live",
    Terminata: "bg-secondary text-white border-white/20",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${map[stato]}`}
    >
      {stato === "In corso" && (
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      )}
      {stato}
    </span>
  );
}

// ─── MatchCard ───────────────────────────────────────────────────────────────
export function MatchCard({
  m,
  compact = false,
}: {
  m: Match;
  compact?: boolean;
}) {
  const hasScore = m.golCasa !== null && m.golOspite !== null;
  const speciale = isSpeciale(m.girone);
  const isFinale = m.girone.toLowerCase() === "finale";

  // Label girone senza "Girone" per SF/F
  const gironeLabel = speciale ? m.girone : m.girone ? `Girone ${m.girone}` : null;

  // Stile bordo e accento per SF/F
  const borderClass = isFinale
    ? "border-amber-500/50"
    : speciale
      ? "border-blue-400/35"
      : "border-white/10";

  const stripeClass = isFinale
    ? "bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0"
    : "bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-blue-400/0";

  const gironeColor = isFinale
    ? "text-amber-400/90"
    : speciale
      ? "text-blue-300/80"
      : "";

  const icon = isFinale ? "🏆" : speciale ? "⚔️" : null;
  const logoSize = isFinale ? "lg" : "md";

  return (
    <article
      className={`group relative rounded-xl bg-secondary text-white border ${borderClass} overflow-hidden hover:shadow-stadium transition`}
    >
      <div className="absolute inset-0 bg-stadium-grid opacity-20" />

      {/* Striscia colorata in cima per SF/F */}
      {speciale && (
        <div className={`absolute top-0 left-0 right-0 h-px ${stripeClass}`} />
      )}

      <div className="relative p-4 md:p-5 flex flex-col gap-3">
        {/* Header: categoria · girone · badge */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{m.categoria}</span>
            {gironeLabel && (
              <span className={gironeColor}>· {gironeLabel}</span>
            )}
            {icon && <span className="text-sm leading-none">{icon}</span>}
          </div>
          <StatoBadge stato={m.stato} />
        </div>

        {/* Squadre + punteggio */}
        <div
          className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 ${speciale ? "py-1" : ""}`}
        >
          {/* Casa */}
          <div className="text-right flex flex-col items-end gap-1.5">
            {speciale && <TeamLogo nome={m.casa} size={logoSize} />}
            <div
              className={`font-display tracking-wide leading-tight ${speciale ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
            >
              {m.casa}
            </div>
          </div>

          {/* Score / VS */}
          <div className="px-3 min-w-[64px] text-center">
            {hasScore ? (
              <div
                className={`font-display tracking-wider ${speciale ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}
              >
                {m.golCasa}
                <span className="text-primary mx-1">–</span>
                {m.golOspite}
              </div>
            ) : (
              <div
                className={`font-display text-white/50 tracking-wider ${speciale ? "text-xl md:text-2xl" : "text-base md:text-lg"}`}
              >
                VS
              </div>
            )}
          </div>

          {/* Ospite */}
          <div className="text-left flex flex-col items-start gap-1.5">
            {speciale && <TeamLogo nome={m.ospite} size={logoSize} />}
            <div
              className={`font-display tracking-wide leading-tight ${speciale ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
            >
              {m.ospite}
            </div>
          </div>
        </div>

        {/* Data · Campo */}
        <div className="flex items-center justify-between text-xs text-white/70">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} className="text-primary" />
            {m.data} · {m.ora}
          </span>
          {m.campo && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} className="text-primary" />
              {m.campo}
            </span>
          )}
        </div>

        {/* Marcatori */}
        {!compact && m.marcatori.length > 0 && (
          <div className="border-t border-white/10 pt-3 text-xs text-white/80">
            <div className="font-bold uppercase tracking-widest text-primary text-[10px] mb-1">
              Marcatori
            </div>
            <ul className="space-y-0.5">
              {m.marcatori.map((g, i) => (
                <li key={i}>
                  ⚽ {g.nome} {g.gol > 1 && `(×${g.gol})`}{" "}
                  <span className="text-white/40">— {g.squadra}</span>
                </li>
              ))}
            </ul>
            {m.mvp && (
              <div className="mt-2 text-[11px]">
                <span className="font-bold text-primary">MVP:</span> {m.mvp}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}