import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/archivio")({
  head: () => ({
    meta: [
      { title: "Archivio — ASD Canalbianco ACV" },
      {
        name: "description",
        content:
          "Archivio storico di tornei, risultati e stagioni ASD Canalbianco ACV.",
      },
      { property: "og:title", content: "Archivio — ASD Canalbianco ACV" },
      {
        property: "og:description",
        content: "Tornei e risultati storici del Canalbianco ACV.",
      },
    ],
  }),
  component: Archivio,
});

function Archivio() {
  return (
    <div className="bg-secondary text-white min-h-[70vh]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-stadium-grid opacity-25" />
        <div className="absolute inset-0 bg-glow-radial" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/75">
            <Archive size={14} className="text-primary" /> Archivio
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-7xl tracking-wide leading-none">
            Storia e risultati
          </h1>
          <p className="mt-4 max-w-2xl text-white/75">
            Tornei, classifiche e tabelloni delle edizioni archiviate.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <Link
          to="/archivio/tornei/trevisan-26"
          className="group grid gap-6 md:grid-cols-[auto_1fr_auto] items-center rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="h-14 w-14 rounded-lg bg-primary text-primary-foreground grid place-items-center shadow-glow">
            <Trophy size={28} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/50">
              Tornei
            </div>
            <h2 className="mt-1 font-display text-2xl md:text-3xl tracking-wide">
              Trevisan Denis 2026
            </h2>
            <p className="mt-2 text-sm text-white/65">
              22° edizione · risultati, classifiche e marcatori
            </p>
          </div>
          <ArrowRight className="text-primary transition group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}
