import { useEffect, useMemo, useState } from "react";
import type { Holiday } from "../../types/holidays";
import { ymd } from "../../utils/date";

export function useHolidays(country: string, year: number, apiKey: string) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://api.api-ninjas.com/v1/holidays?country=${country}`,
          { headers: { "X-Api-Key": apiKey }, signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Holiday[];
        setHolidays(data.filter((h) => h.date.startsWith(`${year}-`)));
      } catch (e: any) {
        if (e.name !== "AbortError") setError("Failed to load holidays.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [country, year, apiKey]);

  const index = useMemo(() => {
    const map = new Map<string, Holiday[]>();
    for (const h of holidays) (map.get(h.date) ?? map.set(h.date, []).get(h.date)!).push(h);
    return map;
  }, [holidays]);

  const isNationalHoliday = (d: Date) =>
    (index.get(ymd(d)) ?? []).some((h) => h.type === "NATIONAL_HOLIDAY");

  return { holidays, loading, error, index, isNationalHoliday };
}
