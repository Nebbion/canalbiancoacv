import { createServerFn } from "@tanstack/react-start";

/**
 * Google Sheet pubblico — sostituibile via env SHEET_ID per ambiente.
 * Foglio: ID | Categoria | Girone | Data | Ora | Squadra Casa | Squadra Ospite |
 *         Gol Casa | Gol Ospite | Stato | Campo | Marcatori | MVP | Note
 *
 * Marcatori formato libero: "Rossi 2, Bianchi" oppure "Rossi(2), Bianchi(1)".
 */
const DEFAULT_SHEET_ID = "1FQYwKN1xNSRbeeHchsRUjWsDRQem2BVhb6IrIdJdbq0";

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

function parseMarcatori(raw: string | null, casa: string, ospite: string): Match["marcatori"] {
  if (!raw) return [];
  // formati supportati:
  //  "Rossi 2, Bianchi"  -> tutti casa (fallback)
  //  "CASA: Rossi 2; OSPITE: Bianchi"  -> separati
  //  "Rossi(2)|casa, Bianchi|ospite"
  const out: Match["marcatori"] = [];
  const trySplit = raw.split(/;|\n/).map((s) => s.trim()).filter(Boolean);
  for (const segment of trySplit) {
    let squadra = casa;
    let body = segment;
    const m = segment.match(/^(CASA|OSPITE)\s*:\s*(.+)$/i);
    if (m) {
      squadra = m[1].toUpperCase() === "CASA" ? casa : ospite;
      body = m[2];
    }
    for (const piece of body.split(",").map((p) => p.trim()).filter(Boolean)) {
      const tagged = piece.match(/^(.+?)\|(casa|ospite)$/i);
      let target = squadra;
      let texto = piece;
      if (tagged) {
        target = tagged[2].toLowerCase() === "casa" ? casa : ospite;
        texto = tagged[1].trim();
      }
      const goalsMatch = texto.match(/(.+?)[\s(]+(\d+)\)?$/);
      const nome = (goalsMatch ? goalsMatch[1] : texto).trim();
      const gol = goalsMatch ? Number(goalsMatch[2]) : 1;
      if (nome) out.push({ squadra: target, nome, gol });
    }
  }
  return out;
}

function normalizeStato(raw: string | null | undefined): MatchStatus {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("corso") || v.includes("live")) return "In corso";
  if (v.includes("term") || v.includes("final") || v.includes("ft")) return "Terminata";
  return "Da giocare";
}

function computeStandings(matches: Match[]): Record<string, StandingsRow[]> {
  const buckets: Record<string, Map<string, StandingsRow>> = {};
  for (const m of matches) {
    if (m.stato !== "Terminata") continue;
    if (m.golCasa === null || m.golOspite === null) continue;
    if (!m.girone) continue;
    const key = `${m.categoria}|${m.girone}`;
    if (!buckets[key]) buckets[key] = new Map();
    const map = buckets[key];
    const ensure = (name: string): StandingsRow => {
      let row = map.get(name);
      if (!row) {
        row = { squadra: name, girone: m.girone, pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0, dr: 0, pti: 0 };
        map.set(name, row);
      }
      return row;
    };
    const home = ensure(m.casa);
    const away = ensure(m.ospite);
    home.pg++; away.pg++;
    home.gf += m.golCasa; home.gs += m.golOspite;
    away.gf += m.golOspite; away.gs += m.golCasa;
    if (m.golCasa > m.golOspite) { home.v++; home.pti += 3; away.p++; }
    else if (m.golCasa < m.golOspite) { away.v++; away.pti += 3; home.p++; }
    else { home.n++; away.n++; home.pti += 1; away.pti += 1; }
    home.dr = home.gf - home.gs;
    away.dr = away.gf - away.gs;
  }
  const out: Record<string, StandingsRow[]> = {};
  for (const [key, map] of Object.entries(buckets)) {
    out[key] = [...map.values()].sort((a, b) => b.pti - a.pti || b.dr - a.dr || b.gf - a.gf || a.squadra.localeCompare(b.squadra));
  }
  return out;
}

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
      else map.set(key, { nome: g.nome, squadra: g.squadra, categoria: m.categoria, gol: g.gol });
    }
  }
  const out: Record<string, Scorer[]> = {};
  for (const [cat, map] of Object.entries(buckets)) {
    out[cat] = [...map.values()].sort((a, b) => b.gol - a.gol || a.nome.localeCompare(b.nome));
  }
  return out;
}

export const getTorneoData = createServerFn({ method: "GET" }).handler(async (): Promise<TorneoData> => {
  const sheetId = process.env.SHEET_ID || DEFAULT_SHEET_ID;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
    if (!res.ok) throw new Error(`Sheet HTTP ${res.status}`);
    const text = await res.text();
    const jsonText = text.replace(/^[^\{]+/, "").replace(/\);?\s*$/, "");
    const data = JSON.parse(jsonText);
    const cols: string[] = data.table.cols.map((c: { label?: string }) => (c.label ?? "").trim());
    const idx = (label: string) => cols.findIndex((c) => c.toLowerCase() === label.toLowerCase());
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

    const cellVal = (row: { c: ({ v: unknown; f?: string } | null)[] }, i: number): string | null => {
      if (i < 0) return null;
      const c = row.c[i];
      if (!c || c.v === null || c.v === undefined || c.v === "") return null;
      return c.f ?? String(c.v);
    };
    const cellNum = (row: { c: ({ v: unknown; f?: string } | null)[] }, i: number): number | null => {
      const v = cellVal(row, i);
      if (v === null) return null;
      const n = Number(String(v).replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };

    const matches: Match[] = (data.table.rows as { c: ({ v: unknown; f?: string } | null)[] }[])
      .map((r, i) => {
        const casa = cellVal(r, ix.casa) ?? "";
        const ospite = cellVal(r, ix.ospite) ?? "";
        if (!casa && !ospite) return null;
        const stato = normalizeStato(cellVal(r, ix.stato));
        const marcatoriRaw = cellVal(r, ix.marcatori);
        return {
          id: cellVal(r, ix.id) ?? String(i + 1),
          categoria: cellVal(r, ix.categoria) ?? "",
          girone: cellVal(r, ix.girone) ?? "",
          data: cellVal(r, ix.data) ?? "",
          ora: cellVal(r, ix.ora) ?? "",
          casa,
          ospite,
          golCasa: cellNum(r, ix.golCasa),
          golOspite: cellNum(r, ix.golOspite),
          stato,
          campo: cellVal(r, ix.campo) ?? "",
          marcatori: parseMarcatori(marcatoriRaw, casa, ospite),
          mvp: cellVal(r, ix.mvp),
          note: cellVal(r, ix.note),
        } satisfies Match;
      })
      .filter((m): m is Match => m !== null);

    const categorie = [...new Set(matches.map((m) => m.categoria).filter(Boolean))];

    return {
      fetchedAt: new Date().toISOString(),
      matches,
      categorie,
      standings: computeStandings(matches),
      scorers: computeScorers(matches),
    };
  } catch (error) {
    console.error("[torneo] fetch error", error);
    return {
      fetchedAt: new Date().toISOString(),
      matches: [],
      categorie: [],
      standings: {},
      scorers: {},
    };
  }
});
