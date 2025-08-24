import { useState } from "react";

type Props = {
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function EmailField({
  name = "email",
  label = "Email Address",
  placeholder = "johndoe@email.com",
  className,
}: Props) {
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState("");
  const isInvalid =
    touched && value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <label className={["block mb-6 w-full max-w-[426px]", className ?? ""].join(" ")}>
      <span className="text-formLabel text-heading">{label}</span>
      <input
        type="email"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        className={[
          "mt-2 w-full h-[48px] rounded-lg border px-[16px] text-[16px] font-medium text-[#000853] leading-none outline-none",
          isInvalid
            ? "border-[#ED4545] border-2 bg-[#FEECEC]"
            : "border-[#CBB6E5] focus:border-[#761BE4] focus:border-2",
          "placeholder:text-[#000853]",
        ].join(" ")}
      />
      {isInvalid && (
        <div className="flex items-start gap-2 mt-2">
          <p className="text-[14px] text-[#000853]">
            Please use correct formatting.<br />
            Example: address@email.com
          </p>
        </div>
      )}
    </label>
  );
}
