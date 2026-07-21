import { useState } from "react";
import { isFinalPhase, type Match } from "@/lib/torneo.functions";
import { Clock, MapPin } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────
function etichettaGirone(girone: string) {
  if (isFinalPhase(girone)) return girone;
  return `Girone ${girone}`;
}

function iniziali(nome: string) {
  return nome
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ─── Logo squadra ────────────────────────────────────────────────────────────
// Metti i file in /public/loghi/ con nome identico alla squadra
// Estensioni supportate: png → jpg → jpeg
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
        : "w-9 h-9 text-[11px]";

  if (failed) {
    return (
      <div
        className={`${dim} rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-bold text-white/50 flex-shrink-0`}
      >
        {iniziali(nome)}
      </div>
    );
  }

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

// ─── Badge stato ─────────────────────────────────────────────────────────────
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

// ─── Card normale ─────────────────────────────────────────────────────────────
function MatchCardNormal({ m, compact }: { m: Match; compact: boolean }) {
  const hasScore = m.golCasa !== null && m.golOspite !== null;

  return (
    <article className="group relative rounded-xl bg-secondary text-white border border-white/10 overflow-hidden hover:shadow-stadium transition">
      <div className="absolute inset-0 bg-stadium-grid opacity-20" />
      <div className="relative p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{m.categoria}</span>
            {m.girone && <span>· {etichettaGirone(m.girone)}</span>}
          </div>
          <StatoBadge stato={m.stato} />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="text-right">
            <div className="font-display text-lg md:text-xl tracking-wide leading-tight">
              {m.casa}
            </div>
          </div>
          <div className="px-3 min-w-[64px] text-center">
            {hasScore ? (
              <div className="font-display text-3xl md:text-4xl tracking-wider">
                {m.golCasa}
                <span className="text-primary mx-1">–</span>
                {m.golOspite}
              </div>
            ) : m.stato === "Terminata" ? (
              <div className="font-display text-3xl md:text-4xl text-white/45 tracking-wider">
                —
              </div>
            ) : (
              <div className="font-display text-base md:text-lg text-white/60 tracking-wider">
                VS
              </div>
            )}
          </div>
          <div className="text-left">
            <div className="font-display text-lg md:text-xl tracking-wide leading-tight">
              {m.ospite}
            </div>
          </div>
        </div>

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

// ─── Card speciale (Semifinale / Finale) ──────────────────────────────────────
function MatchCardSpeciale({ m, compact }: { m: Match; compact: boolean }) {
  const hasScore = m.golCasa !== null && m.golOspite !== null;
  const isFinale = m.girone.toLowerCase().startsWith("finale");

  const borderColor = isFinale ? "border-amber-400/40" : "border-blue-400/30";
  const gradientBg = isFinale
    ? "from-amber-500/10 via-secondary to-secondary"
    : "from-blue-500/8 via-secondary to-secondary";
  const accentColor = isFinale ? "text-amber-300" : "text-blue-300";
  const badgeCls = isFinale
    ? "bg-amber-500/15 text-amber-300 border-amber-400/30"
    : "bg-blue-500/15 text-blue-300 border-blue-400/30";
  const scoreSep = isFinale ? "text-amber-400" : "text-blue-400";
  const icon = isFinale ? "🏆" : "⚔️";

  return (
    <article
      className={`group relative rounded-xl text-white border ${borderColor} bg-gradient-to-br ${gradientBg} overflow-hidden hover:shadow-stadium transition`}
    >
      <div className="absolute inset-0 bg-stadium-grid opacity-10" />

      {/* Header */}
      <div className="relative flex items-center gap-2.5 px-4 pt-4 pb-2">
        <span className="text-base">{icon}</span>
        <div className="flex-1 flex items-center gap-2 text-[11px] uppercase tracking-widest">
          <span className={`font-bold ${accentColor}`}>{m.categoria}</span>
          <span className="text-white/40">·</span>
          <span className={`font-semibold ${accentColor}`}>{m.girone}</span>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${badgeCls}`}
        >
          {m.stato === "In corso" && (
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
          )}
          {m.stato}
        </span>
      </div>

      {/* Squadre con loghi */}
      <div className="relative px-4 py-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamLogo nome={m.casa} size="lg" />
            <div className="font-display text-base md:text-lg tracking-wide leading-tight">
              {m.casa}
            </div>
          </div>

          <div className="min-w-[72px] text-center">
            {hasScore ? (
              <div className="font-display text-3xl md:text-4xl tracking-wider">
                {m.golCasa}
                <span className={`${scoreSep} mx-1.5`}>–</span>
                {m.golOspite}
              </div>
            ) : m.stato === "Terminata" ? (
              <div
                className={`font-display text-3xl md:text-4xl ${accentColor} opacity-50 tracking-wider`}
              >
                —
              </div>
            ) : (
              <div
                className={`font-display text-xl font-light tracking-widest ${accentColor} opacity-60`}
              >
                VS
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <TeamLogo nome={m.ospite} size="lg" />
            <div className="font-display text-base md:text-lg tracking-wide leading-tight">
              {m.ospite}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between px-4 pb-4 text-xs text-white/50">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={11} className={accentColor} />
          {m.data} · {m.ora}
        </span>
        {m.campo && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={11} className={accentColor} />
            {m.campo}
          </span>
        )}
      </div>

      {/* Marcatori */}
      {!compact && m.marcatori.length > 0 && (
        <div className="relative border-t border-white/10 px-4 py-3 text-xs text-white/80">
          <div
            className={`font-bold uppercase tracking-widest text-[10px] mb-1 ${accentColor}`}
          >
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
              <span className={`font-bold ${accentColor}`}>MVP:</span> {m.mvp}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// ─── Export principale ────────────────────────────────────────────────────────
export function MatchCard({
  m,
  compact = false,
}: {
  m: Match;
  compact?: boolean;
}) {
  if (isFinalPhase(m.girone)) {
    return <MatchCardSpeciale m={m} compact={compact} />;
  }
  return <MatchCardNormal m={m} compact={compact} />;
}
