/**
 * torneo.functions.ts
 * Fetch dei dati del torneo da Google Sheets (pubblicato pubblicamente).
 *
 * Google Sheet — colonne previste nel foglio "Partite":
 *   ID | Categoria | Girone | Data | Ora | Squadra Casa | Squadra Ospite |
 *   Gol Casa | Gol Ospite | Stato | Campo | Marcatori | MVP | Note
 *
 * Stato: "Da giocare" | "In corso" | "Terminata"
 * Marcatori (formato libero):
 *   "Rossi 2, Bianchi 1"
 *   "CASA: Rossi 2; OSPITE: Bianchi 1"
 *   "Rossi(2)|casa, Bianchi(1)|ospite"
 *
 * Per attivare: imposta VITE_TORNEO_SHEET_ID nel file .env
 *   VITE_TORNEO_SHEET_ID=1AbCdEfGhIjKlMnOpQrStu...
 * Il foglio deve essere condiviso pubblicamente (Chiunque con link → Visualizzatore)
 * e pubblicato sul web (File → Condividi → Pubblica sul web → CSV).
 */

export type MatchStatus = "Da giocare" | "In corso" | "Terminata";

export interface Match {
  id: string;
  categoria: string;
  girone: string;
  data: string;
  ora: string;
  casa: string;
  ospite: string;
  golCasa: number | null;
  golOspite: number | null;
  stato: MatchStatus;
  campo: string;
  marcatori: { squadra: string; nome: string; gol: number }[];
  mvp: string | null;
  note: string | null;
}

export interface StandingsRow {
  squadra: string;
  girone: string;
  pg: number;
  v: number;
  n: number;
  p: number;
  gf: number;
  gs: number;
  dr: number;
  pti: number;
}

export interface Scorer {
  nome: string;
  squadra: string;
  categoria: string;
  gol: number;
}

export interface TorneoData {
  fetchedAt: string;
  matches: Match[];
  categorie: string[];
  standings: Record<string, StandingsRow[]>; // chiave: `${categoria}|${girone}`
  scorers: Record<string, Scorer[]>; // chiave: categoria
}

export const EMPTY_TORNEO_DATA: TorneoData = {
  fetchedAt: "",
  matches: [],
  categorie: [],
  standings: {},
  scorers: {},
};

export function isFinalPhase(girone: string) {
  const value = girone.toLowerCase().trim();
  return value.includes("semifinale") || value.startsWith("finale");
}

function isByeTeam(nome: string) {
  return nome.trim().toLowerCase() === "riposa";
}

// ─── Parser marcatori ───────────────────────────────────────────────────────
function parseMarcatori(
  raw: string | null,
  casa: string,
  ospite: string,
): Match["marcatori"] {
  if (!raw) return [];
  const out: Match["marcatori"] = [];
  const segments = raw
    .split(/;|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const segment of segments) {
    let squadra = casa;
    let body = segment;
    const teamMatch = segment.match(/^(CASA|OSPITE)\s*:\s*(.+)$/i);
    if (teamMatch) {
      squadra = teamMatch[1].toUpperCase() === "CASA" ? casa : ospite;
      body = teamMatch[2];
    }
    for (const piece of body
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)) {
      const tagged = piece.match(/^(.+?)\|(casa|ospite)$/i);
      let target = squadra;
      let testo = piece;
      if (tagged) {
        target = tagged[2].toLowerCase() === "casa" ? casa : ospite;
        testo = tagged[1].trim();
      }
      const goalsMatch = testo.match(/(.+?)[\s(]+(\d+)\)?$/);
      const nome = (goalsMatch ? goalsMatch[1] : testo).trim();
      const gol = goalsMatch ? Number(goalsMatch[2]) : 1;
      if (nome) out.push({ squadra: target, nome, gol });
    }
  }
  return out;
}

function normalizeStato(raw: string | null | undefined): MatchStatus {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("corso") || v.includes("live")) return "In corso";
  if (v.includes("term") || v.includes("final") || v === "ft")
    return "Terminata";
  return "Da giocare";
}

// ─── Classifiche ───────────────────────────────────────────────────────────
function computeStandings(matches: Match[]): Record<string, StandingsRow[]> {
  const buckets: Record<string, Map<string, StandingsRow>> = {};

  for (const m of matches) {
    if (!m.girone || !m.categoria) continue;
    const speciale = isFinalPhase(m.girone);
    const key = `${m.categoria}|${m.girone}`;

    if (!buckets[key]) buckets[key] = new Map();
    const map = buckets[key];

    const ensure = (name: string): StandingsRow => {
      let row = map.get(name);
      if (!row) {
        row = {
          squadra: name,
          girone: m.girone,
          pg: 0,
          v: 0,
          n: 0,
          p: 0,
          gf: 0,
          gs: 0,
          dr: 0,
          pti: 0,
        };
        map.set(name, row);
      }
      return row;
    };

    // Per gironi speciali registra solo le squadre (senza calcolare punti)
    if (speciale) {
      if (!m.casa.includes("°")) ensure(m.casa);
      if (!m.ospite.includes("°")) ensure(m.ospite);
      continue;
    }

    // Gironi normali — solo partite terminate
    if (m.stato !== "Terminata" || m.golCasa === null || m.golOspite === null)
      continue;

    const home = ensure(m.casa);
    const away = ensure(m.ospite);
    home.pg++;
    away.pg++;
    home.gf += m.golCasa;
    home.gs += m.golOspite;
    away.gf += m.golOspite;
    away.gs += m.golCasa;
    if (m.golCasa > m.golOspite) {
      home.v++;
      home.pti += 3;
      away.p++;
    } else if (m.golCasa < m.golOspite) {
      away.v++;
      away.pti += 3;
      home.p++;
    } else {
      home.n++;
      away.n++;
      home.pti++;
      away.pti++;
    }
    home.dr = home.gf - home.gs;
    away.dr = away.gf - away.gs;
  }

  const out: Record<string, StandingsRow[]> = {};
  for (const [key, map] of Object.entries(buckets)) {
    out[key] = [...map.values()].sort(
      (a, b) =>
        b.pti - a.pti ||
        b.dr - a.dr ||
        b.gf - a.gf ||
        a.squadra.localeCompare(b.squadra),
    );
  }
  return out;
}

// ─── Marcatori ─────────────────────────────────────────────────────────────
function computeScorers(matches: Match[]): Record<string, Scorer[]> {
  const buckets: Record<string, Map<string, Scorer>> = {};
  for (const m of matches) {
    if (!m.marcatori.length) continue;
    if (!buckets[m.categoria]) buckets[m.categoria] = new Map();
    const map = buckets[m.categoria];
    for (const g of m.marcatori) {
      const key = `${g.nome}|${g.squadra}`;
      const cur = map.get(key);
      if (cur) cur.gol += g.gol;
      else
        map.set(key, {
          nome: g.nome,
          squadra: g.squadra,
          categoria: m.categoria,
          gol: g.gol,
        });
    }
  }
  const out: Record<string, Scorer[]> = {};
  for (const [cat, map] of Object.entries(buckets)) {
    out[cat] = [...map.values()].sort(
      (a, b) => b.gol - a.gol || a.nome.localeCompare(b.nome),
    );
  }
  return out;
}

// ─── Fetch principale (browser) ────────────────────────────────────────────
export async function getTorneoData(): Promise<TorneoData> {
  const sheetId = import.meta.env.VITE_TORNEO_SHEET_ID as string | undefined;

  if (!sheetId) {
    console.info(
      "[torneo] VITE_TORNEO_SHEET_ID non configurato — live pronto per la prossima edizione.",
    );
    return EMPTY_TORNEO_DATA;
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sheet HTTP ${res.status}`);

    const text = await res.text();
    // La risposta Google è JSONP: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
    const jsonText = text.replace(/^[^{]+/, "").replace(/\);?\s*$/, "");
    const data = JSON.parse(jsonText) as {
      table: {
        cols: { label?: string }[];
        rows: { c: ({ v: unknown; f?: string } | null)[] }[];
      };
    };

    const cols = data.table.cols.map((c) => (c.label ?? "").trim());
    const idx = (label: string) =>
      cols.findIndex((c) => c.toLowerCase() === label.toLowerCase());

    const ix = {
      id: idx("ID"),
      categoria: idx("Categoria"),
      girone: idx("Girone"),
      data: idx("Data"),
      ora: idx("Ora"),
      casa: idx("Squadra Casa"),
      ospite: idx("Squadra Ospite"),
      golCasa: idx("Gol Casa"),
      golOspite: idx("Gol Ospite"),
      stato: idx("Stato"),
      campo: idx("Campo"),
      marcatori: idx("Marcatori"),
      mvp: idx("MVP"),
      note: idx("Note"),
    };

    type Row = { c: ({ v: unknown; f?: string } | null)[] };

    const cellVal = (row: Row, i: number): string | null => {
      if (i < 0) return null;
      const c = row.c[i];
      if (!c || c.v === null || c.v === undefined || c.v === "") return null;
      return (c.f ?? String(c.v)).trim();
    };

    const cellNum = (row: Row, i: number): number | null => {
      const v = cellVal(row, i);
      if (v === null) return null;
      const n = Number(String(v).replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };

    const matches: Match[] = (data.table.rows as Row[])
      .map((r, i) => {
        const casa = cellVal(r, ix.casa) ?? "";
        const ospite = cellVal(r, ix.ospite) ?? "";
        if ((!casa && !ospite) || isByeTeam(casa) || isByeTeam(ospite))
          return null;
        return {
          id: cellVal(r, ix.id) ?? `row-${i + 1}`,
          categoria: cellVal(r, ix.categoria) ?? "",
          girone: cellVal(r, ix.girone) ?? "",
          data: cellVal(r, ix.data) ?? "",
          ora: cellVal(r, ix.ora) ?? "",
          casa,
          ospite,
          golCasa: cellNum(r, ix.golCasa),
          golOspite: cellNum(r, ix.golOspite),
          stato: normalizeStato(cellVal(r, ix.stato)),
          campo: cellVal(r, ix.campo) ?? "",
          marcatori: parseMarcatori(cellVal(r, ix.marcatori), casa, ospite),
          mvp: cellVal(r, ix.mvp),
          note: cellVal(r, ix.note),
        } satisfies Match;
      })
      .filter((m): m is Match => m !== null);

    const categorie = [
      ...new Set(matches.map((m) => m.categoria).filter(Boolean)),
    ];

    return {
      fetchedAt: new Date().toISOString(),
      matches,
      categorie,
      standings: computeStandings(matches),
      scorers: computeScorers(matches),
    };
  } catch (err) {
    console.error("[torneo] Errore fetch:", err);
    return EMPTY_TORNEO_DATA;
  }
}
