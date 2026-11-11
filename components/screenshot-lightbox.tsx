"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function ScreenshotLightbox({
  src,
  name,
  date,
  onClose,
}: {
  src: string;
  name?: string;
  date?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
  }, []);

  function requestClose() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={name ? `Screenshot from ${name}` : "Customer screenshot"}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose();
      }}
      className="m-auto w-[min(960px,calc(100vw-2rem))] rounded-3xl border-0 bg-[#11120f] p-3 text-white shadow-[0_28px_80px_rgb(0_0_0/0.45)] backdrop:bg-[#10110f]/80"
    >
      <div className="relative">
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close screenshot"
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-[#11120f]/80 text-white hover:bg-[#11120f]"
        >
          <X className="size-5" />
        </button>
        <div className="relative h-[min(78vh,820px)] w-full overflow-hidden rounded-2xl bg-[#1b1c18]">
          <Image
            src={src}
            alt={name ? `Screenshot from ${name}` : "Customer screenshot"}
            fill
            sizes="960px"
            className="object-contain"
          />
        </div>
        {name || date ? (
          <p className="px-3 py-3 text-sm font-bold">
            {name}
            {date ? (
              <span className="ml-2 text-xs font-medium text-white/55">{date}</span>
            ) : null}
          </p>
        ) : null}
      </div>
    </dialog>
  );
}
