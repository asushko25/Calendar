import React from "react";

type Props = {
  photo: File | null;
  selectedDate: Date | null;
  time: string | null;
  isBlockedDate: (d: Date) => boolean;
};

export const Button: React.FC<Props> = ({
  photo,
  selectedDate,
  time,
  isBlockedDate,
}) => {
  const disabled =
    !photo ||
    !selectedDate ||
    !time ||
    (selectedDate ? isBlockedDate(selectedDate) : true);

  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-[48px] w-full py-3 rounded-md bg-purple-600 text-white font-medium disabled:bg-purple-300"
    >
      Send Application
    </button>
  );
};
