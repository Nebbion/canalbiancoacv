import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const categorie = [
  { nome: "Piccoli Amici", anni: "2019-2020", desc: "Primi passi con il pallone, gioco e divertimento." },
  { nome: "Primi Calci", anni: "2017-2018", desc: "Coordinazione, tecnica di base, squadra." },
  { nome: "Pulcini", anni: "2015-2016", desc: "Partite a 7, fondamentali e fair play." },
  { nome: "Esordienti", anni: "2013-2014", desc: "Calcio a 9, tattica individuale e di squadra." },
  { nome: "Giovanissimi", anni: "2011-2012", desc: "Calcio a 11, agonismo formativo." },
  { nome: "Allievi", anni: "2009-2010", desc: "Preparazione al calcio senior, intensità di gioco." },
  { nome: "Prima Squadra", anni: "Seniores", desc: "Il top della società, in campionato federale." },
];

export const Route = createFileRoute("/squadre")({
  head: () => ({
    meta: [
      { title: "Squadre — ASD Canalbianco ACV" },
      { name: "description", content: "Settore giovanile e prima squadra ASD Canalbianco ACV: Piccoli Amici, Primi Calci, Pulcini, Esordienti, Giovanissimi, Allievi, Prima Squadra." },
      { property: "og:title", content: "Le squadre del Canalbianco ACV" },
      { property: "og:description", content: "Tutte le categorie dalla scuola calcio alla Prima Squadra." },
    ],
  }),
  component: Squadre,
});

function Squadre() {
  return (
    <div className="bg-background">
      <section className="bg-secondary text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-stadium-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <span className="text-primary font-bold uppercase tracking-widest text-sm">Settore giovanile + prima squadra</span>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide mt-2">Le nostre squadre</h1>
          <p className="mt-4 text-white/80 max-w-2xl">Dai più piccoli alla Prima Squadra: tutte le categorie del Canalbianco ACV.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categorie.map((c) => (
          <article key={c.nome} className="group rounded-xl bg-card border border-border p-6 hover:shadow-stadium hover:-translate-y-1 transition">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.anni}</div>
            <h2 className="font-display text-2xl tracking-wide mt-1">{c.nome}</h2>
            <p className="text-sm text-muted-foreground mt-3">{c.desc}</p>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              Scopri <ArrowRight size={14} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
