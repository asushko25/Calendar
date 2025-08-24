export type HolidayType = "NATIONAL_HOLIDAY" | "OBSERVANCE" | string;

export type Holiday = {
  name: string;
  date: string;
  country: string;
  type: HolidayType;
};

export type HolidaysByDate = Record<string, Holiday[]>;