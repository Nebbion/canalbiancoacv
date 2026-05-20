import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Trophy, Users, Newspaper, Camera } from "lucide-react";
import hero from "@/assets/hero-stadium.jpg";
import logo from "@/assets/logo-canalbianco.png";

const categorie = [
  { slug: "piccoli-amici", nome: "Piccoli Amici", anni: "2019-2020" },
  { slug: "primi-calci", nome: "Primi Calci", anni: "2017-2018" },
  { slug: "pulcini", nome: "Pulcini", anni: "2015-2016" },
  { slug: "esordienti", nome: "Esordienti", anni: "2013-2014" },
  { slug: "giovanissimi", nome: "Giovanissimi", anni: "2011-2012" },
  { slug: "allievi", nome: "Allievi", anni: "2009-2010" },
  { slug: "prima-squadra", nome: "Prima Squadra", anni: "Seniores" },
];

const news = [
  { titolo: "Al via il 22° Torneo Trevisan Denis", data: "18 maggio 2026", excerpt: "Tre categorie e venti sere di calcio a Villamarzana." },
  { titolo: "Memorial Luca Coltro 2026", data: "30 maggio 2026", excerpt: "Sabato 30 maggio l'edizione 2026 ad Arquà Polesine." },
  { titolo: "Torneo Avis-Aido di Villamarzana", data: "23 maggio 2026", excerpt: "Piccoli Amici e Primi Calci in campo per la solidarietà." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASD Canalbianco ACV — Sito ufficiale" },
      { name: "description", content: "Società calcistica del Polesine. Settore giovanile, prima squadra e il 22° Torneo Trevisan Denis 2026 con risultati live." },
      { property: "og:title", content: "ASD Canalbianco ACV — Sito ufficiale" },
      { property: "og:description", content: "Settore giovanile, prima squadra e 22° Torneo Trevisan Denis 2026 live." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden text-white min-h-[88vh] flex items-center">
        <img src={hero} alt="" width={1920} height={1080} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/80 via-secondary/70 to-secondary" />
        <div className="absolute inset-0 -z-10 bg-stadium-grid opacity-40" />
        <div className="absolute inset-0 -z-10 bg-glow-radial" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 grid gap-10 md:grid-cols-[1.4fr_1fr] items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest text-white/80">
              <span className="h-2 w-2 rounded-full bg-primary pulse-live" />
              Stagione 2025/2026
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide">
              <span className="text-white">ASD CANALBIANCO</span><br />
              <span className="text-primary text-glow">A.C.V.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
              Passione, fair play, amicizia. Dal 2013 cresciamo insieme ai ragazzi del Polesine — sul campo e fuori.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/torneo" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-glow hover:brightness-110">
                Scopri il Torneo <ArrowRight size={18} />
              </Link>
              <Link to="/squadre" className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 backdrop-blur px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/15">
                Le Squadre
              </Link>
              <Link to="/contatti" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white hover:border-white/40">
                Contatti
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="absolute -inset-10 bg-primary/30 blur-3xl rounded-full" />
              <img src={logo} alt="Logo ASD Canalbianco ACV" width={420} height={420} className="relative w-72 lg:w-96 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* TORNEO HIGHLIGHT */}
      <section className="relative bg-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-stadium-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid gap-10 md:grid-cols-[1fr_auto] items-center">
          <div>
            <span className="text-primary text-sm font-bold uppercase tracking-widest">In evidenza</span>
            <h2 className="mt-2 font-display text-4xl md:text-6xl tracking-wide">
              22° Torneo <span className="text-primary text-glow">"Trevisan Denis"</span>
            </h2>
            <p className="mt-4 text-white/80 text-lg max-w-2xl">
              Dal <strong>18 maggio</strong> al <strong>6 giugno 2026</strong> · Campo Sportivo di Villamarzana<br />
              3 categorie · Pulcini ore 19 · Esordienti ore 20 · Giovanissimi ore 21
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/torneo" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-glow hover:brightness-110">
                Vai al torneo live <ArrowRight size={16} />
              </Link>
              <Link to="/torneo/calendario" className="rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white/10">
                Calendario
              </Link>
              <Link to="/torneo/classifiche" className="rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white/10">
                Classifiche
              </Link>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3">
            {[
              { icon: Users, label: "Fair play" },
              { icon: Trophy, label: "Passione" },
              { icon: Calendar, label: "Amicizia" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 backdrop-blur px-5 py-3">
                <b.icon className="text-primary" size={22} />
                <span className="font-display tracking-wider text-lg">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIE */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="text-primary text-sm font-bold uppercase tracking-widest">Settore giovanile + prima squadra</span>
              <h2 className="font-display text-4xl md:text-5xl tracking-wide mt-2">Le nostre squadre</h2>
            </div>
            <Link to="/squadre" className="text-sm font-semibold uppercase tracking-wider text-primary hover:underline">
              Vedi tutte →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categorie.map((c) => (
              <Link
                key={c.slug}
                to="/squadre"
                className="group relative overflow-hidden rounded-xl bg-secondary text-white p-6 min-h-[180px] flex flex-col justify-end transition hover:-translate-y-1 hover:shadow-stadium"
              >
                <div className="absolute inset-0 bg-stadium-grid opacity-30 group-hover:opacity-60 transition" />
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/30 blur-2xl group-hover:bg-primary/50 transition" />
                <div className="relative">
                  <div className="text-xs uppercase tracking-widest text-white/60">{c.anni}</div>
                  <div className="font-display text-2xl tracking-wider mt-1">{c.nome}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Scopri <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS + GALLERY teaser */}
      <section className="py-20 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm"><Newspaper size={16} /> News società</div>
            <h2 className="font-display text-4xl tracking-wide mt-2 mb-6">Ultime dal club</h2>
            <ul className="space-y-4">
              {news.map((n) => (
                <li key={n.titolo} className="rounded-xl bg-card p-5 border-l-4 border-primary hover:shadow-stadium transition">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{n.data}</div>
                  <div className="font-display text-xl mt-1">{n.titolo}</div>
                  <p className="text-sm text-muted-foreground mt-2">{n.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm"><Camera size={16} /> Gallery</div>
            <h2 className="font-display text-4xl tracking-wide mt-2 mb-6">In campo</h2>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-secondary relative overflow-hidden">
                  <div className="absolute inset-0 bg-stadium-grid opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
                </div>
              ))}
            </div>
            <Link to="/gallery" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary hover:underline">
              Vedi gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTATTI / MAPPA */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <span className="text-primary text-sm font-bold uppercase tracking-widest">Dove giochiamo</span>
            <h2 className="font-display text-4xl md:text-5xl tracking-wide mt-2">Campo Sportivo di Villamarzana</h2>
            <p className="mt-4 text-muted-foreground text-lg">Vieni a tifare la squadra: ingresso libero, atmosfera di paese, calcio vero.</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2"><MapPin className="text-primary" size={18} /> Villamarzana (RO) — Polesine</div>
              <Link to="/contatti" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-glow hover:brightness-110">
                Contattaci <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-stadium border border-border">
            <iframe
              title="Mappa Villamarzana"
              src="https://www.openstreetmap.org/export/embed.html?bbox=11.74%2C44.99%2C11.79%2C45.03&amp;layer=mapnik&amp;marker=45.0115%2C11.7625"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
