import { createFileRoute, Link } from "@tanstack/react-router";
import { useTorneoData, parseItalianDate } from "@/lib/use-torneo";
import { MatchCard } from "@/components/torneo/MatchCard";
import { useMemo } from "react";
import { QrCode } from "lucide-react";

export const Route = createFileRoute("/torneo/")({
  component: TorneoLive,
});

function TorneoLive() {
  const { data, isLoading } = useTorneoData();

  const { live, prossime, recenti } = useMemo(() => {
    const all = data?.matches ?? [];
    const sorted = [...all].sort((a, b) => parseItalianDate(a.data) - parseItalianDate(b.data) || a.ora.localeCompare(b.ora));
    return {
      live: sorted.filter((m) => m.stato === "In corso"),
      prossime: sorted.filter((m) => m.stato === "Da giocare").slice(0, 6),
      recenti: sorted.filter((m) => m.stato === "Terminata").slice(-6).reverse(),
    };
  }, [data]);

  if (isLoading) return <SectionWrap><Skeleton /></SectionWrap>;

  return (
    <SectionWrap>
      {/* INFO + QR */}
      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] mb-12">
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h2 className="font-display text-2xl tracking-wide text-primary">Il torneo in numeri</h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { k: "Categorie", v: "3" },
              { k: "Squadre", v: String(new Set([...(data?.matches ?? []).flatMap((m) => [m.casa, m.ospite])]).size) },
              { k: "Partite", v: String(data?.matches.length ?? 0) },
            ].map((s) => (
              <div key={s.k} className="rounded-lg bg-secondary border border-white/10 p-3 text-center">
                <div className="font-display text-3xl text-primary">{s.v}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{s.k}</div>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid sm:grid-cols-3 gap-2 text-sm">
            {["Pulcini · ore 19:00", "Esordienti · ore 20:00", "Giovanissimi · ore 21:00"].map((x) => (
              <li key={x} className="rounded-md bg-secondary border-l-2 border-primary px-3 py-2">{x}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-6 flex items-center gap-4">
          <div className="rounded-lg bg-white p-2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "https://canalbiancoacv.it/torneo")}`}
              alt="QR per la pagina torneo"
              width={160}
              height={160}
              className="block"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest"><QrCode size={14} /> Condividi</div>
            <h3 className="font-display text-xl tracking-wide mt-1">Inquadra per i live</h3>
            <p className="text-xs text-white/70 mt-1">Apri la pagina torneo da qualsiasi smartphone.</p>
          </div>
        </div>
      </div>

      {/* LIVE */}
      <Block
        title="Partite in corso"
        empty="Nessuna partita in corso adesso."
        items={live}
        accent
      />

      {/* Prossime */}
      <Block
        title="Prossime partite"
        empty="Calendario completato."
        items={prossime}
        action={<Link to="/torneo/calendario" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">Calendario completo →</Link>}
      />

      {/* Recenti */}
      <Block
        title="Ultimi risultati"
        empty="Ancora nessun risultato."
        items={recenti}
        action={<Link to="/torneo/classifiche" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">Vedi classifiche →</Link>}
      />
    </SectionWrap>
  );
}

function SectionWrap({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">{children}</div>;
}

function Block({
  title, items, empty, accent, action,
}: {
  title: string;
  items: Parameters<typeof MatchCard>[0]["m"][];
  empty: string;
  accent?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-4">
        <h2 className={`font-display text-2xl md:text-3xl tracking-wide ${accent ? "text-primary text-glow" : ""}`}>{title}</h2>
        {action}
      </div>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-white/60">{empty}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((m) => <MatchCard key={m.id} m={m} />)}
        </div>
      )}
    </section>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-44 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
      ))}
    </div>
  );
}
