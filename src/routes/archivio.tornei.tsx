import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/archivio/tornei")({
  head: () => ({
    meta: [
      { title: "Archivio Tornei — ASD Canalbianco ACV" },
      {
        name: "description",
        content: "Archivio dei tornei ASD Canalbianco ACV.",
      },
    ],
  }),
  component: ArchivioTornei,
});

function ArchivioTornei() {
  return (
    <div className="bg-secondary text-white min-h-[70vh]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-stadium-grid opacity-25" />
        <div className="absolute inset-0 bg-glow-radial" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-[11px] uppercase tracking-[0.28em] text-primary font-bold">
            Archivio / Tornei
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-7xl tracking-wide leading-none">
            Tornei
          </h1>
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
            <h2 className="font-display text-2xl md:text-3xl tracking-wide">
              Trevisan Denis 2026
            </h2>
            <p className="mt-2 text-sm text-white/65">
              22° edizione · Villamarzana · 18 maggio - 6 giugno 2026
            </p>
          </div>
          <ArrowRight className="text-primary transition group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}
