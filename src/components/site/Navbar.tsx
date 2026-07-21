import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Archive, Menu, X } from "lucide-react";
import logo from "@/assets/logo-canalbianco.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/squadre", label: "Squadre" },
  { to: "/torneo", label: "Torneo" },
  { to: "/archivio", label: "Archivio" },
  { to: "/news", label: "News" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contatti", label: "Contatti" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-secondary/90 border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between text-white">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="ASD Canalbianco ACV"
            width={40}
            height={40}
            className="h-9 w-9 md:h-11 md:w-11"
          />
          <div className="leading-tight">
            <div className="font-display text-lg md:text-xl tracking-wider">
              CANALBIANCO ACV
            </div>
            <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-widest">
              A.S.D. dal 2013
            </div>
          </div>
        </Link>
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="px-3 py-2 text-sm font-medium uppercase tracking-wider text-white/80 hover:text-white transition"
                activeProps={{
                  className:
                    "px-3 py-2 text-sm font-medium uppercase tracking-wider text-white border-b-2 border-primary",
                }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/archivio/tornei/trevisan-26"
              className="ml-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-glow hover:brightness-110 transition"
            >
              <Archive size={16} />
              Archivio 2026
            </Link>
          </li>
        </ul>
        <button
          aria-label="Menu"
          className="md:hidden p-2 rounded-md hover:bg-white/10"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden bg-secondary border-t border-white/10 text-white">
          <ul className="px-4 py-4 space-y-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-md text-base font-medium uppercase tracking-wider hover:bg-white/10"
                  activeProps={{
                    className:
                      "block px-3 py-3 rounded-md text-base font-medium uppercase tracking-wider bg-primary text-primary-foreground",
                  }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
