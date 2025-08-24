import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../UI/SubmitButton";
import EmailField from "../../UI/EmailField";
import FileDropzone from "../../UI/FileDropzone";
import TimeSlots from "../../UI/TimeSlots";
import { useHolidays } from "../../hooks/useHolidays";
import { MONTH_NAMES } from "../../../types/monthNames";
import { ymd, isSunday, buildMonthMatrix } from "../../../utils/date";

const monthNames = MONTH_NAMES;

export const Main = () => {
  const MIN = 0;
  const MAX = 100;
  const THUMB = 16;
  const BUBBLE_W = 37;

  const [age, setAge] = useState(25);
  const sliderRef = useRef<HTMLInputElement>(null);
  const bubbleWrapRef = useRef<HTMLDivElement>(null);
  const [bubbleLeft, setBubbleLeft] = useState(0);

  const recalcBubble = () => {
    const slider = sliderRef.current,
      wrap = bubbleWrapRef.current;
    if (!slider || !wrap) return;
    const rectSlider = slider.getBoundingClientRect();
    const rectWrap = wrap.getBoundingClientRect();
    const p = (age - MIN) / (MAX - MIN);
    const track = rectSlider.width - THUMB;
    const centerX = rectSlider.left - rectWrap.left + p * track + THUMB / 2;
    const pad = Math.max(0, (rectWrap.width - rectSlider.width) / 2);
    const leftRaw = centerX - BUBBLE_W / 2;
    const left = Math.max(
      -pad,
      Math.min(leftRaw, rectWrap.width - BUBBLE_W + pad)
    );
    setBubbleLeft(left);
  };

  useLayoutEffect(() => {
    recalcBubble();
    const onResize = () => recalcBubble();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [age]);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const allowTypes = ["image/", "application/pdf"];
  const accept = "application/pdf,image/*";

  const handleFileChange = (f: File | null) => {
    if (!f) {
      setPhoto(null);
      setPhotoError(null);
      return;
    }
    const ok = allowTypes.some((t) => f.type.startsWith(t));
    if (!ok) {
      setPhoto(null);
      setPhotoError("Only images (JPG/PNG) and PDFs are allowed.");
      return;
    }
    setPhotoError(null);
    setPhoto(f);
  };

  const API_KEY = import.meta.env.VITE_API_NINJAS_KEY as string;
  const COUNTRY = "PL";
  const CURRENT_YEAR = new Date().getFullYear();

  const [viewYear] = useState(CURRENT_YEAR);
  const [viewMonth0, setViewMonth0] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const {
    loading: loadingHolidays,
    error: holidaysError,
    index: holidayIndex,
    isNationalHoliday,
  } = useHolidays(COUNTRY, CURRENT_YEAR, API_KEY);

  const isBlockedDate = (d: Date) => isSunday(d) || isNationalHoliday(d);

  const holidayInfo = useMemo(() => {
    if (!selectedDate) return null;
    const hs = holidayIndex.get(ymd(selectedDate)) ?? [];
    const nat = hs.filter((h) => h.type === "NATIONAL_HOLIDAY");
    const obs = hs.filter((h) => h.type === "OBSERVANCE");
    if (nat.length)
      return {
        type: "NATIONAL_HOLIDAY" as const,
        names: nat.map((h) => h.name).join(", "),
      };
    if (obs.length)
      return {
        type: "OBSERVANCE" as const,
        names: obs.map((h) => h.name).join(", "),
      };
    return null;
  }, [selectedDate, holidayIndex]);

  const matrix = useMemo(
    () => buildMonthMatrix(viewYear, viewMonth0),
    [viewYear, viewMonth0]
  );

  const canPrev = viewMonth0 > 0;
  const canNext = viewMonth0 < 11;
  const prevMonth = () => {
    if (!canPrev) return;
    setSelectedDate(null);
    setViewMonth0((m) => Math.max(0, m - 1));
  };
  const nextMonth = () => {
    if (!canNext) return;
    setSelectedDate(null);
    setViewMonth0((m) => Math.min(11, m + 1));
  };

  const times = ["12:00", "14:00", "16:30", "18:30", "20:00"] as const;
  const [time, setTime] = useState<string | null>(null);

  const canPickTime =
    !!selectedDate &&
    !isSunday(selectedDate) &&
    !isNationalHoliday(selectedDate);

  useEffect(() => {
    if (!canPickTime && time) setTime(null);
  }, [canPickTime, time]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center pt-120 pb-120 px-[24px] sm:px-4">
      <form
        className="w-full max-w-formMobile md:max-w-formDesktop bg-transparent"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData();
          if (photo) fd.append("photo", photo);
          fd.append("age", String(age));
          if (selectedDate) fd.append("date", ymd(selectedDate));
          if (time) fd.append("time", time);
          console.log("FormData prepared:", fd);
        }}
      >
        <section>
          <h2 className="mb-8 text-h2 text-heading">Personal info</h2>

          <label className="block mb-6">
            <span className="text-formLabel text-heading">First Name</span>
            <input
              type="text"
              placeholder="John"
              className="mt-2 w-full h-[48px] rounded-lg border border-[#CBB6E5] px-[16px]
                         text-[16px] font-medium text-[#000853] leading-none
                         outline-none focus:border-[#761BE4] focus:border-2
                         invalid:border-[#ED4545] invalid:border-2 invalid:bg-[#FEECEC]
                         placeholder:text-[#000853]"
            />
          </label>

          <label className="block mb-6">
            <span className="text-formLabel text-heading">Last Name</span>
            <input
              type="text"
              placeholder="Doe"
              className="mt-2 w-full h-[48px] rounded-lg border border-[#CBB6E5] px-[16px]
                         text-[16px] font-medium text-[#000853] leading-none
                         outline-none focus:border-[#761BE4] focus:border-2
                         invalid:border-[#ED4545] invalid:border-2 invalid:bg-[#FEECEC]
                         placeholder:text-[#000853]"
            />
          </label>

          <EmailField />

          <label className="block w-full max-w-[426px] h-[92px] mb-11">
            <span className="text-formLabel text-heading">Age</span>
            <div className="flex justify-between text-[12px] font-normal text-heading mt-4">
              <span>{MIN}</span> <span>{MAX}</span>
            </div>
            <div className="relative mt-2">
              <input
                ref={sliderRef}
                type="range"
                min={MIN}
                max={MAX}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="range-age w-full relative z-10"
              />
              <div
                ref={bubbleWrapRef}
                className="absolute w-[438px] left-1/2 -translate-x-1/2 pointer-events-none select-none"
              >
                <div className="absolute" style={{ left: bubbleLeft }}>
                  <div className="relative w-[37px] h-[31px]">
                    <svg
                      width="37"
                      height="31"
                      viewBox="0 0 37 31"
                      xmlns="http://www.w3.org/2000/svg"
                      className="block"
                    >
                      <mask id="bubble-mask" fill="white">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M22.3971 6L18.5 0L14.6029 6H4C1.79086 6 0 7.79086 0 10V27C0 29.2091 1.79086 31 4 31H33C35.2091 31 37 29.2091 37 27V10C37 7.79086 35.2091 6 33 6H22.3971Z"
                        />
                      </mask>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M22.3971 6L18.5 0L14.6029 6H4C1.79086 6 0 7.79086 0 10V27C0 29.2091 1.79086 31 4 31H33C35.2091 31 37 29.2091 37 27V10C37 7.79086 35.2091 6 33 6H22.3971Z"
                        fill="#FAF9FA"
                      />
                      <path
                        d="M18.5 0L19.3386 -0.544705L18.5 -1.83586L17.6614 -0.544705L18.5 0ZM22.3971 6L21.5585 6.5447L21.8542 7H22.3971V6ZM14.6029 6V7H15.1458L15.4415 6.5447L14.6029 6ZM17.6614 0.544705L21.5585 6.5447L23.2357 5.4553L19.3386 -0.544705L17.6614 0.544705ZM15.4415 6.5447L19.3386 0.544705L17.6614 -0.544705L13.7643 5.4553L15.4415 6.5447ZM4 7H14.6029V5H4V7ZM1 10C1 8.34315 2.34315 7 4 7V5C1.23858 5 -1 7.23858 -1 10H1ZM1 27V10H-1V27H1ZM4 30C2.34315 30 1 28.6569 1 27H-1C-1 29.7614 1.23858 32 4 32V30ZM33 30H4V32H33V30ZM36 27C36 28.6569 34.6569 30 33 30V32C35.7614 32 38 29.7614 38 27H36ZM36 10V27H38V10H36ZM33 7C34.6569 7 36 8.34315 36 10H38C38 7.23858 35.7614 5 33 5V7ZM22.3971 7H33V5H22.3971V7Z"
                        fill="#CBB6E5"
                        mask="url(#bubble-mask)"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[14px] font-medium leading-none text-[#761BE4]">
                      {age}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <FileDropzone
            value={photo}
            onChange={handleFileChange}
            error={photoError}
            accept={accept}
          />
        </section>

        <section>
          <h2 className="mb-8 text-h2 text-heading">Your workout</h2>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-[326px] shrink-0">
              <span className="text-formLabel text-heading">Date</span>

              <div className="mt-2 w-[343px] h-[308px] sm:w-[326px] sm:h-[292px] rounded-md border border-[#CBB6E5] bg-white p-3">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={prevMonth}
                    disabled={!canPrev}
                    className="px-1 py-1 rounded text-[#000853] disabled:opacity-40"
                    aria-label="Prev month"
                  >
                    ‹
                  </button>
                  <div className="text-sm font-medium text-[#000853]">
                    {monthNames[viewMonth0]} {viewYear}
                  </div>
                  <button
                    type="button"
                    onClick={nextMonth}
                    disabled={!canNext}
                    className="px-1 py-1 rounded text-[#000853] disabled:opacity-40"
                    aria-label="Next month"
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-[11px] text-[#000853] mb-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {matrix.flat().map((d, i) => {
                    const inMonth =
                      d.getMonth() === viewMonth0 &&
                      d.getFullYear() === viewYear;
                    const blocked = isBlockedDate(d);
                    const sel = selectedDate && ymd(d) === ymd(selectedDate);
                    const hasObs = (holidayIndex.get(ymd(d)) ?? []).some(
                      (h) => h.type === "OBSERVANCE"
                    );
                    const hasNat = (holidayIndex.get(ymd(d)) ?? []).some(
                      (h) => h.type === "NATIONAL_HOLIDAY"
                    );

                    const textCls = inMonth
                      ? isSunday(d) || hasNat
                        ? "text-[#898DA9]"
                        : "text-[#000853]"
                      : "text-[#898DA9]";

                    return (
                      <button
                        type="button"
                        key={i}
                        disabled={!inMonth || blocked}
                        onClick={() => setSelectedDate(new Date(d))}
                        className={[
                          "w-8 h-8 grid place-items-center rounded-full text-sm",
                          textCls,
                          !inMonth || blocked ? "cursor-not-allowed" : "",
                          sel && !hasNat
                            ? "bg-[#761BE4] text-white"
                            : "bg-transparent",
                          hasObs && !hasNat && !sel && !blocked
                            ? "ring-1 ring-[#761BE4]/40"
                            : "",
                        ].join(" ")}
                        title={holidayIndex
                          .get(ymd(d))
                          ?.map((h) => h.name)
                          .join(", ")}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>

                {selectedDate && isSunday(selectedDate) && (
                  <p className="mt-3 text=[12px] text-[#ED4545]">
                    No workouts on Sundays.
                  </p>
                )}

                {loadingHolidays && (
                  <p className="mt-2 text-[12px] text-[#898DA9]">
                    Loading holidays…
                  </p>
                )}
                {holidaysError && (
                  <p className="mt-2 text-[12px] text-[#ED4545]">
                    {holidaysError}
                  </p>
                )}
              </div>
            </div>

            {canPickTime && (
              <div className="w-full md:w-[76px] shrink-0">
                <span className="text-formLabel text-heading">Time</span>
                <TimeSlots slots={times} value={time} onChange={setTime} />
              </div>
            )}
          </div>
        </section>

        {selectedDate && holidayInfo && (
          <p className="mt-3 text-[12px] text-[#898DA9] flex items-center gap-1">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17C7.418 17 5.871 16.531 4.555 15.652C3.24 14.773 2.214 13.523 1.609 12.062C1.003 10.6 0.845 8.991 1.154 7.439C1.462 5.887 2.224 4.462 3.343 3.343C4.462 2.224 5.887 1.462 7.439 1.154C8.991 0.845 10.6 1.003 12.062 1.609C13.523 2.214 14.773 3.24 15.652 4.555C16.531 5.871 17 7.418 17 9C17 11.122 16.157 13.157 14.657 14.657C13.157 16.157 11.122 17 9 17ZM8.007 13C8.007 13.265 8.112 13.52 8.3 13.707C8.487 13.895 8.741 14 9.007 14C9.272 14 9.526 13.895 9.714 13.707C9.901 13.52 10.007 13.265 10.007 13V8.407C10.007 8.275 9.981 8.145 9.931 8.024C9.88 7.903 9.807 7.792 9.714 7.7C9.621 7.607 9.511 7.533 9.389 7.483C9.268 7.433 9.138 7.407 9.007 7.407C8.875 7.407 8.745 7.433 8.624 7.483C8.503 7.533 8.392 7.607 8.3 7.7C8.207 7.792 8.133 7.903 8.083 8.024C8.033 8.145 8.007 8.275 8.007 8.407V13ZM9 4C8.773 4 8.552 4.067 8.363 4.193C8.174 4.319 8.027 4.498 7.941 4.708C7.854 4.917 7.831 5.148 7.875 5.37C7.92 5.593 8.029 5.797 8.189 5.957C8.35 6.118 8.554 6.227 8.776 6.271C8.999 6.316 9.229 6.293 9.439 6.206C9.648 6.119 9.827 5.972 9.953 5.784C10.079 5.596 10.147 5.373 10.147 5.147C10.147 4.843 10.026 4.551 9.811 4.336C9.596 4.121 9.304 4 9 4Z"
                fill="#CBB6E5"
              />
            </svg>
            It is <span className="text-[#000853]">{holidayInfo.names}</span>.
          </p>
        )}

        <Button
          photo={photo}
          selectedDate={selectedDate}
          time={time}
          isBlockedDate={isBlockedDate}
        />
      </form>
    </main>
  );
};
