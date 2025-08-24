import { useRef } from "react";

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string | null;
  accept?: string;
  className?: string;
};

export default function FileDropzone({
  value,
  onChange,
  error,
  accept = "application/pdf,image/*",
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };
  const onFile = (f: File | null) => onChange(f);
  const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    onFile(e.target.files?.[0] ?? null);
  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    onFile(e.dataTransfer.files?.[0] ?? null);
  };
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) =>
    e.preventDefault();

  return (
    <div className={["block w-full max-w-[426px] mb-12", className ?? ""].join(" ")}>
      <span className="text-formLabel text-heading">Photo</span>

      <div
        onClick={open}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="mt-2 flex items-center justify-center w-full h-[96px] rounded-lg border border-[#CBB6E5] bg-[#FFFFFF] cursor-pointer transition-colors"
      >
        {!value ? (
          <span className="text-[16px] font-normal">
            <span className="text-[#761BE4] underline underline-offset-4">Upload a file</span>
            <span className="text-[#898DA9]"> or drag and drop here</span>
          </span>
        ) : (
          <div className="px-4 py-2 flex items-center gap-2">
            <span className="text-[#000853] text-[16px] font-normal max-w-[220px] truncate">
              {value.name}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              aria-label="Remove file"
              className="grid place-items-center w-6 h-6 rounded-md"
              title="Remove file"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM9.879 8.464C9.699 8.283 9.457 8.177 9.202 8.168C8.947 8.16 8.699 8.249 8.507 8.417C8.316 8.586 8.196 8.822 8.173 9.076C8.149 9.33 8.224 9.583 8.381 9.784L8.465 9.879L10.585 12L8.465 14.121C8.284 14.301 8.178 14.543 8.169 14.798C8.161 15.052 8.25 15.301 8.418 15.493C8.587 15.684 8.823 15.804 9.077 15.827C9.331 15.851 9.584 15.776 9.785 15.619L9.879 15.536L12 13.414L14.121 15.536C14.301 15.717 14.543 15.823 14.798 15.832C15.052 15.84 15.301 15.751 15.493 15.583C15.684 15.414 15.804 15.178 15.827 14.924C15.851 14.67 15.776 14.417 15.619 14.216L15.536 14.121L13.414 12L15.536 9.879C15.717 9.699 15.823 9.457 15.832 9.202C15.84 8.947 15.751 8.699 15.583 8.507C15.414 8.316 15.178 8.196 14.924 8.173C14.67 8.149 14.417 8.224 14.216 8.381L14.121 8.464L12 10.586L9.879 8.464Z"
                  className="fill-[#000853] hover:fill-[#ED4545] transition-colors duration-200"
                />
              </svg>
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChangeInput}
        />
      </div>

      {error && <p className="mt-2 text-[14px] text-[#ED4545]">{error}</p>}
    </div>
  );
}
