export { MONTH_NAMES } from "../types/monthNames";
export type { MonthName } from "../types/monthNames";
export const pad2 = (n: number) => n.toString().padStart(2, "0");
export const ymd = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const isSunday = (d: Date) => d.getDay() === 0;

export const WEEKDAYS_SHORT = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export function buildMonthMatrix(year: number, month0: number) {
  const first = new Date(year, month0, 1);
  const prevDays = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const cells = prevDays + daysInMonth;
  const rows = Math.ceil(cells / 7);

  return Array.from({ length: rows }, (_, r) =>
    Array.from(
      { length: 7 },
      (_, c) => new Date(year, month0, r * 7 + c + 1 - prevDays)
    )
  );
}

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
