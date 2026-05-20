import type { Match } from "@/lib/torneo.functions";
import { Clock, MapPin } from "lucide-react";

function StatoBadge({ stato }: { stato: Match["stato"] }) {
  const map = {
    "Da giocare": "bg-white/10 text-white/80 border-white/20",
    "In corso": "bg-primary text-primary-foreground border-primary pulse-live",
    Terminata: "bg-secondary text-white border-white/20",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${map[stato]}`}>
      {stato === "In corso" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      {stato}
    </span>
  );
}

export function MatchCard({ m, compact = false }: { m: Match; compact?: boolean }) {
  const hasScore = m.golCasa !== null && m.golOspite !== null;
  return (
    <article className="group relative rounded-xl bg-secondary text-white border border-white/10 overflow-hidden hover:shadow-stadium transition">
      <div className="absolute inset-0 bg-stadium-grid opacity-20" />
      <div className="relative p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{m.categoria}</span>
            {m.girone && <span>· Girone {m.girone}</span>}
          </div>
          <StatoBadge stato={m.stato} />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="text-right">
            <div className="font-display text-lg md:text-xl tracking-wide leading-tight">{m.casa}</div>
          </div>
          <div className="px-3 min-w-[64px] text-center">
            {hasScore ? (
              <div className="font-display text-3xl md:text-4xl tracking-wider">
                {m.golCasa}<span className="text-primary mx-1">–</span>{m.golOspite}
              </div>
            ) : (
              <div className="font-display text-base md:text-lg text-white/60 tracking-wider">VS</div>
            )}
          </div>
          <div className="text-left">
            <div className="font-display text-lg md:text-xl tracking-wide leading-tight">{m.ospite}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-white/70">
          <span className="inline-flex items-center gap-1.5"><Clock size={12} className="text-primary" />{m.data} · {m.ora}</span>
          {m.campo && <span className="inline-flex items-center gap-1.5"><MapPin size={12} className="text-primary" />{m.campo}</span>}
        </div>

        {!compact && m.marcatori.length > 0 && (
          <div className="border-t border-white/10 pt-3 text-xs text-white/80">
            <div className="font-bold uppercase tracking-widest text-primary text-[10px] mb-1">Marcatori</div>
            <ul className="space-y-0.5">
              {m.marcatori.map((g, i) => (
                <li key={i}>⚽ {g.nome} {g.gol > 1 && `(×${g.gol})`} <span className="text-white/40">— {g.squadra}</span></li>
              ))}
            </ul>
            {m.mvp && <div className="mt-2 text-[11px]"><span className="font-bold text-primary">MVP:</span> {m.mvp}</div>}
          </div>
        )}
      </div>
    </article>
  );
}
