import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { hasLiveTorneoSource, useTorneoData } from "@/lib/use-torneo";
import {
  Archive,
  CalendarDays,
  ListOrdered,
  Goal,
  Trophy,
  RefreshCw,
} from "lucide-react";

const tabs = [
  { to: "/torneo", label: "Live", icon: Trophy, exact: true },
  {
    to: "/torneo/calendario",
    label: "Calendario",
    icon: CalendarDays,
    exact: false,
  },
  {
    to: "/torneo/classifiche",
    label: "Classifiche",
    icon: ListOrdered,
    exact: false,
  },
  { to: "/torneo/marcatori", label: "Marcatori", icon: Goal, exact: false },
] as const;

export const Route = createFileRoute("/torneo")({
  head: () => ({
    meta: [
      { title: "Torneo Trevisan Denis — Canalbianco ACV" },
      {
        name: "description",
        content:
          "Pagina live del Torneo Trevisan Denis, pronta per la prossima edizione a Villamarzana.",
      },
      {
        property: "og:title",
        content: "Torneo Trevisan Denis — Canalbianco ACV",
      },
      {
        property: "og:description",
        content: "Il live del torneo sarà aggiornato alla prossima edizione.",
      },
    ],
  }),
  component: TorneoLayout,
});

function TorneoLayout() {
  const { data, isFetching, dataUpdatedAt } = useTorneoData();
  const location = useLocation();
  const updated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;
  const liveConfigured = hasLiveTorneoSource;

  return (
    <div className="bg-secondary text-white">
      {/* Hero torneo */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-stadium-grid opacity-30" />
        <div className="absolute inset-0 bg-glow-radial" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest text-white/80">
            <span
              className={`h-2 w-2 rounded-full ${liveConfigured ? "bg-primary pulse-live" : "bg-white/50"}`}
            />
            {liveConfigured ? "Live attivo" : "Prossima edizione"}
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-7xl tracking-wide leading-[0.95]">
            TORNEO
            <br />
            "TREVISAN DENIS"
          </h1>
          <p className="mt-3 text-white/80 text-base md:text-lg">
            {liveConfigured
              ? "Risultati, calendario, classifiche e marcatori in aggiornamento."
              : "La nuova edizione sarà pubblicata qui appena disponibile."}
          </p>

          {/* Tabs sticky */}
          <div className="mt-8 -mx-4 md:mx-0 overflow-x-auto">
            <div className="flex gap-2 px-4 md:px-0 min-w-max">
              {tabs.map((t) => {
                const isActive = t.exact
                  ? location.pathname === t.to
                  : location.pathname.startsWith(t.to);
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-white/5 border border-white/15 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <t.icon size={16} /> {t.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Status bar live */}
      <div className="border-b border-white/10 bg-secondary/80 backdrop-blur sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between text-xs text-white/70">
          {liveConfigured ? (
            <>
              <span className="inline-flex items-center gap-2">
                <RefreshCw
                  size={12}
                  className={isFetching ? "animate-spin text-primary" : ""}
                />
                {isFetching
                  ? "Aggiornamento…"
                  : updated
                    ? `Aggiornato alle ${updated.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                    : "—"}
              </span>
              <span className="hidden sm:inline">
                Auto-refresh ogni 30 s · {data?.matches.length ?? 0} partite
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-2">
                <Archive size={12} className="text-primary" />
                Live in preparazione
              </span>
              <Link
                to="/archivio/tornei/trevisan-26"
                className="font-bold uppercase tracking-wider text-primary hover:underline"
              >
                Archivio 2026
              </Link>
            </>
          )}
        </div>
      </div>

      <Outlet />
    </div>
  );
}
