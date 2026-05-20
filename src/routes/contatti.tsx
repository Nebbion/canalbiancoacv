import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Clock, Navigation } from "lucide-react";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — ASD Canalbianco ACV" },
      { name: "description", content: "Contatta ASD Canalbianco ACV: i 3 campi sportivi di Villamarzana, Arquà Polesine e Costa di Rovigo, email e telefono." },
      { property: "og:title", content: "Contatti — ASD Canalbianco ACV" },
      { property: "og:description", content: "Vieni a trovarci a Villamarzana, Arquà Polesine o Costa di Rovigo." },
    ],
  }),
  component: Contatti,
});

const CAMPI = [
  {
    nome: "Campo Sportivo Villamarzana",
    indirizzo: "Via Piave 8, Villamarzana (RO)",
    iframe:
      "https://www.openstreetmap.org/export/embed.html?bbox=11.74%2C44.99%2C11.79%2C45.03&amp;layer=mapnik&amp;marker=45.0115%2C11.7625",
  },
  {
    nome: "Campo Sportivo Arquà Polesine",
    indirizzo: "Via Stazione 261, Arquà Polesine (RO)",
    iframe:
      "https://www.openstreetmap.org/export/embed.html?bbox=11.71%2C44.98%2C11.76%2C45.02&amp;layer=mapnik&amp;marker=45.000%2C11.735",
  },
  {
    nome: "Campo Sportivo Costa di Rovigo",
    indirizzo: "Via Cala Storta 219, Costa di Rovigo (RO)",
    iframe:
      "https://www.openstreetmap.org/export/embed.html?bbox=11.67%2C45.01%2C11.72%2C45.05&amp;layer=mapnik&amp;marker=45.030%2C11.695",
  },
];

function Contatti() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-secondary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-stadium-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="font-display text-5xl md:text-7xl tracking-wide">Contatti</h1>
          <p className="mt-3 text-white/80">Tre campi sportivi nel cuore del Polesine.</p>
        </div>
      </section>

      {/* Campi sportivi */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-8">I nostri campi</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {CAMPI.map((c) => (
            <div
              key={c.nome}
              className="rounded-2xl overflow-hidden border border-border bg-card shadow-stadium flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <iframe
                  title={`Mappa ${c.nome}`}
                  src={c.iframe}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="text-primary mt-1 shrink-0" size={18} />
                  <div>
                    <div className="font-semibold text-card-foreground">{c.nome}</div>
                    <div className="text-sm text-muted-foreground mt-1">{c.indirizzo}</div>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.indirizzo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-glow hover:brightness-110 transition"
                >
                  <Navigation size={16} />
                  Indicazioni stradali
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info di contatto */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-8">Info</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Mail, k: "Email", v: "info@canalbiancoacv.it" },
            { icon: Phone, k: "Telefono", v: "Su richiesta via email" },
            { icon: Clock, k: "Orari allenamenti", v: "Lun–Ven, pomeriggio/sera" },
            { icon: MapPin, k: "Sede", v: "Villamarzana (RO)" },
          ].map((c) => (
            <div key={c.k} className="flex items-start gap-4 rounded-xl bg-card border border-border p-5">
              <c.icon className="text-primary mt-1" size={18} />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.k}</div>
                <div className="font-semibold text-card-foreground">{c.v}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
