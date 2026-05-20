import { createFileRoute } from "@tanstack/react-router";

const news = [
  { titolo: "Al via il 22° Torneo Trevisan Denis", data: "18 maggio 2026", excerpt: "Tre categorie e venti sere di calcio a Villamarzana, dal 18 maggio al 6 giugno." },
  { titolo: "Memorial Luca Coltro 2026", data: "30 maggio 2026", excerpt: "Sabato 30 maggio l'edizione 2026 ad Arquà Polesine — Piccoli Amici e Primi Calci." },
  { titolo: "Torneo Avis-Aido di Villamarzana", data: "23 maggio 2026", excerpt: "Una giornata di calcio e solidarietà per i più piccoli." },
];

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — ASD Canalbianco ACV" },
      { name: "description", content: "Ultime notizie e comunicazioni della società ASD Canalbianco ACV." },
      { property: "og:title", content: "News — ASD Canalbianco ACV" },
      { property: "og:description", content: "Tutte le novità dalla società." },
    ],
  }),
  component: News,
});

function News() {
  return (
    <div className="bg-background">
      <section className="bg-secondary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-stadium-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="font-display text-5xl md:text-7xl tracking-wide">News</h1>
          <p className="mt-3 text-white/80">Le ultime dal Canalbianco ACV.</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-16 space-y-5">
        {news.map((n) => (
          <article key={n.titolo} className="rounded-xl bg-card border-l-4 border-primary border border-border p-6 hover:shadow-stadium transition">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{n.data}</div>
            <h2 className="font-display text-2xl tracking-wide mt-1">{n.titolo}</h2>
            <p className="text-muted-foreground mt-3">{n.excerpt}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
