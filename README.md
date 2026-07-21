# ASD Canalbianco ACV — Sito Ufficiale

Stack: **React 19 + TypeScript + Vite + TanStack Router + TanStack Query + Tailwind CSS v4**

## 🚀 Deploy su Vercel (5 minuti)

1. **Push su GitHub** — carica questa cartella in un repo
2. **Importa su Vercel** — [vercel.com/new](https://vercel.com/new) → Import Git Repository
3. **Impostazioni build** (Vercel le rileva automaticamente):
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Variabile d'ambiente** (opzionale, per dati live torneo):
   - `VITE_TORNEO_SHEET_ID` = ID del nuovo Google Sheet del torneo live

## ⚙️ Sviluppo locale

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run build      # build produzione
npm run preview    # anteprima build locale
```

## 📊 Google Sheets — Dati live torneo

### Struttura foglio

Crea un Google Sheet con un foglio chiamato **Partite** con queste colonne:

| ID   | Categoria | Girone | Data       | Ora   | Squadra Casa     | Squadra Ospite | Gol Casa | Gol Ospite | Stato     | Campo        | Marcatori | MVP | Note |
| ---- | --------- | ------ | ---------- | ----- | ---------------- | -------------- | -------- | ---------- | --------- | ------------ | --------- | --- | ---- |
| P-A1 | Pulcini   | A      | 18/05/2026 | 19:00 | Virtus Academy A | Union Vis      | 2        | 1          | Terminata | Villamarzana | Rossi 2   |     |      |

**Valori Stato:** `Da giocare` · `In corso` · `Terminata`

**Formato Marcatori:**

- `Rossi 2, Bianchi 1` → tutti squadra casa
- `CASA: Rossi 2; OSPITE: Bianchi 1` → separati per squadra
- `Rossi(2)|casa, Bianchi(1)|ospite` → formato alternativo

### Setup foglio

1. Condividi il foglio: **Condividi → Chiunque con il link → Visualizzatore**
2. Pubblica sul web: **File → Condividi → Pubblica sul web → CSV → Pubblica**
3. Copia l'ID dall'URL: `docs.google.com/spreadsheets/d/**<<ID>>**/edit`
4. Imposta la variabile d'ambiente:
   - **Locale:** copia `.env.example` in `.env` e incolla l'ID
   - **Vercel:** Project Settings → Environment Variables → `VITE_TORNEO_SHEET_ID`

Senza `VITE_TORNEO_SHEET_ID` il live resta vuoto e pronto per la prossima edizione. L'edizione 2026 è archiviata in `/archivio/tornei/trevisan-26`.

## 🏗️ Struttura progetto

```
├── main.tsx              # Entry point React
├── index.html            # Template HTML
├── vite.config.ts        # Config Vite + TanStack Router plugin
├── vercel.json           # SPA rewrite + cache headers
├── .env.example          # Template variabili d'ambiente
└── src/
    ├── router.tsx         # Router singleton + QueryClient
    ├── styles.css         # Tailwind v4 + design system
    ├── assets/            # Logo, immagini
    ├── components/
    │   ├── site/          # Navbar, Footer
    │   ├── torneo/        # MatchCard
    │   └── ui/            # shadcn/ui components
    ├── hooks/             # use-mobile
    ├── lib/
    │   ├── torneo-2026.ts       # Snapshot statico archivio Trevisan 2026
    │   ├── torneo.functions.ts  # Fetch Google Sheets + calcolo classifiche
    │   └── use-torneo.ts        # React Query hook (refresh ogni 30s)
    └── routes/
        ├── __root.tsx           # Layout globale (Navbar + Footer)
        ├── index.tsx            # Homepage
        ├── squadre.tsx          # Categorie
        ├── news.tsx             # News
        ├── gallery.tsx          # Gallery
        ├── contatti.tsx         # Contatti + campi
        ├── torneo.tsx           # Layout torneo (tabs)
        ├── torneo.index.tsx     # Dashboard live
        ├── torneo.calendario.tsx # Calendario partite
        ├── torneo.classifiche.tsx # Classifiche
        ├── torneo.marcatori.tsx  # Classifica marcatori
        ├── archivio.tsx          # Indice archivio
        ├── archivio.tornei.tsx   # Archivio tornei
        └── archivio.tornei.trevisan-26.tsx # Archivio statico Trevisan 2026
```
