import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — ASD Canalbianco ACV" },
      { name: "description", content: "Foto dalle partite e dagli eventi della società ASD Canalbianco ACV." },
      { property: "og:title", content: "Gallery — ASD Canalbianco ACV" },
      { property: "og:description", content: "Le foto dal campo e dagli eventi del club." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <div className="bg-background">
      <section className="bg-secondary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-stadium-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="font-display text-5xl md:text-7xl tracking-wide">Gallery</h1>
          <p className="mt-3 text-white/80">Momenti dal campo. Presto online le foto delle partite.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-secondary relative overflow-hidden group">
              <div className="absolute inset-0 bg-stadium-grid opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent group-hover:from-primary/60 transition" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
