type Props = {
  slots: readonly string[];
  value: string | null;
  onChange: (v: string) => void;
  className?: string;
};

export default function TimeSlots({ slots, value, onChange, className }: Props) {
  return (
    <div className={["mt-2 flex flex-row flex-wrap gap-2 md:flex-col", className ?? ""].join(" ")}>
      {slots.map((t) => {
        const active = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={[
              "w-[76px] h-[46px] rounded-[8px] border bg-[#ffffff] grid place-items-center text-[16px] leading-none",
              active
                ? "border-[#761BE4] border-2 text-[#000853]"
                : "border-[#CBB6E5] text-[#000853] hover:border-[#761BE4] hover:text-[#761BE4]",
            ].join(" ")}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
