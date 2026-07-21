import { useQuery } from "@tanstack/react-query";
import {
  EMPTY_TORNEO_DATA,
  getTorneoData,
  type TorneoData,
} from "@/lib/torneo.functions";

export const hasLiveTorneoSource = Boolean(
  import.meta.env.VITE_TORNEO_SHEET_ID,
);

export function useTorneoData() {
  return useQuery<TorneoData>({
    queryKey: ["torneo"],
    queryFn: () => getTorneoData(),
    enabled: hasLiveTorneoSource,
    initialData: EMPTY_TORNEO_DATA,
    refetchInterval: hasLiveTorneoSource ? 30_000 : false,
    refetchOnWindowFocus: hasLiveTorneoSource,
    staleTime: 15_000,
  });
}

export function parseItalianDate(d: string): number {
  // "DD/MM/YYYY" → timestamp UTC
  const m = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return 0;
  const yyyy = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  return Date.UTC(yyyy, Number(m[2]) - 1, Number(m[1]));
}
