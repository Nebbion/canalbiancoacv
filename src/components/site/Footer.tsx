import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Mail, Phone } from "lucide-react";
import logo from "@/assets/logo-canalbianco.png";

export function Footer() {
  return (
    <footer className="bg-secondary text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="" width={48} height={48} className="h-12 w-12" />
            <div>
              <div className="font-display text-xl tracking-wider">CANALBIANCO ACV</div>
              <div className="text-xs text-white/60 uppercase tracking-widest">A.S.D. dal 2013</div>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Società sportiva dilettantistica del Polesine. Passione, fair play, amicizia.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg tracking-wider mb-4 text-primary">Naviga</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/squadre" className="text-white/80 hover:text-white">Squadre</Link></li>
            <li><Link to="/torneo" className="text-white/80 hover:text-white">22° Torneo Trevisan Denis</Link></li>
            <li><Link to="/news" className="text-white/80 hover:text-white">News</Link></li>
            <li><Link to="/gallery" className="text-white/80 hover:text-white">Gallery</Link></li>
            <li><Link to="/contatti" className="text-white/80 hover:text-white">Contatti</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg tracking-wider mb-4 text-primary">Contatti</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-primary" />Campo Sportivo, Villamarzana (RO)</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-primary" />info@canalbiancoacv.it</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-primary" />+39 — su richiesta</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg tracking-wider mb-4 text-primary">Seguici</h4>
          <div className="flex gap-3">
            <a aria-label="Facebook" href="https://www.facebook.com/canalbiancoacv" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-primary transition"><Facebook size={18} /></a>
            <a aria-label="Instagram" href="https://www.instagram.com/canalbianco_acv" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-primary transition"><Instagram size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} ASD Canalbianco ACV — Tutti i diritti riservati
      </div>
    </footer>
  );
}
