"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { formatDisplayDate } from "@/lib/dates";
import { galleryPages } from "@/lib/gallery-pages";

export type GalleryShot = {
  key: string;
  label: string;
  image?: string;
  date?: string;
};

const frame =
  "relative flex min-h-32 items-center justify-center overflow-hidden rounded-2xl text-center sm:min-h-44";
const photoCell = `${frame} border border-[#d8d9d3] bg-[#e9eae5]`;
const navCell = `${frame} flex-col gap-3 border border-[#11120f] bg-[#11120f] p-4 text-white`;

export function RepairGallery({ shots }: { shots: GalleryShot[] }) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const pages = galleryPages(shots);
  const current = pages[Math.min(page, pages.length - 1)] ?? pages[0];
  const navInGrid =
    current.showMore || (current.showPrevious && current.items.length < current.slots);
  const fillers = Math.max(0, current.slots - current.items.length - (navInGrid ? 1 : 0));

  function go(next: number) {
    setDirection(next > page ? 1 : -1);
    setPage(next);
  }

  return (
    <div className="relative mt-7 overflow-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -28 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative grid grid-cols-2 gap-3 md:grid-cols-3"
        >
          {current.showPrevious && !navInGrid ? (
            <button
              type="button"
              onClick={() => go(page - 1)}
              className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#11120f]/85 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white"
            >
              <ArrowLeft className="size-3.5" />
              Previous pictures
            </button>
          ) : null}
          {current.items.map((shot) => (
            <figure key={shot.key} className={photoCell}>
              {shot.image ? (
                <Image
                  src={shot.image}
                  alt={shot.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="text-[#777a73]">
                  <Camera className="mx-auto size-7" strokeWidth={1.5} />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em]">
                    Photo placeholder
                  </p>
                  <p className="mt-1 text-xs">{shot.label}</p>
                </div>
              )}
              {shot.date ? (
                <figcaption className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-[#11120f]/70 px-2 py-0.5 text-left text-[0.62rem] font-medium text-white/80">
                  {formatDisplayDate(shot.date)}
                </figcaption>
              ) : null}
            </figure>
          ))}
          {navInGrid ? (
            <div className={navCell}>
              {current.showPrevious ? (
                <button
                  type="button"
                  onClick={() => go(page - 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white/70 hover:text-white"
                >
                  <ArrowLeft className="size-3.5" />
                  Previous pictures
                </button>
              ) : null}
              {current.showMore ? (
                <button
                  type="button"
                  onClick={() => go(page + 1)}
                  className="font-display inline-flex items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-[#b6ff2e]"
                >
                  See more pictures
                  <ArrowRight className="size-4" />
                </button>
              ) : null}
            </div>
          ) : null}
          {Array.from({ length: fillers }).map((_, index) => (
            <div key={`empty-${index}`} aria-hidden="true" className={frame} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
