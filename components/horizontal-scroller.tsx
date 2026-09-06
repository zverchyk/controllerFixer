"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

// dancing monkeys — one row of cards, sideways only, never the whole page.
export function HorizontalScroller({
  children,
  className,
  scrollerRef,
  label,
  autoAdvanceMs,
  loop = false,
}: {
  children: ReactNode;
  className?: string;
  scrollerRef?: RefObject<HTMLDivElement | null>;
  label?: string;
  autoAdvanceMs?: number;
  loop?: boolean;
}) {
  const fallbackRef = useRef<HTMLDivElement>(null);
  const trackRef = scrollerRef ?? fallbackRef;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function handleWheel(event: WheelEvent) {
      const track = trackRef.current;
      if (!track) return;

      const raw =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
      if (raw === 0) return;

      // Line-mode wheels report tiny deltas that would barely move the row.
      const distance = event.deltaMode === 1 ? raw * 40 : raw;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft >= maxScroll - 1;

      if ((distance < 0 && atStart) || (distance > 0 && atEnd)) return;

      event.preventDefault();
      track.scrollLeft = Math.max(
        0,
        Math.min(maxScroll, track.scrollLeft + distance),
      );
    }

    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;

    function handlePointerDown(event: PointerEvent) {
      const track = trackRef.current;
      if (!track || event.pointerType !== "mouse" || event.button !== 0) return;

      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(event.pointerId);
      track.dataset.dragging = "true";
    }

    function handlePointerMove(event: PointerEvent) {
      const track = trackRef.current;
      if (!track || pointerId !== event.pointerId) return;

      track.scrollLeft = startScroll - (event.clientX - startX);
    }

    function handlePointerRelease(event: PointerEvent) {
      const track = trackRef.current;
      if (!track || pointerId !== event.pointerId) return;

      pointerId = null;
      delete track.dataset.dragging;
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    }

    track.addEventListener("wheel", handleWheel, { passive: false });
    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointermove", handlePointerMove);
    track.addEventListener("pointerup", handlePointerRelease);
    track.addEventListener("pointercancel", handlePointerRelease);

    return () => {
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("pointerdown", handlePointerDown);
      track.removeEventListener("pointermove", handlePointerMove);
      track.removeEventListener("pointerup", handlePointerRelease);
      track.removeEventListener("pointercancel", handlePointerRelease);
    };
  }, [trackRef]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !autoAdvanceMs) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    // The duplicated second half lets the row rewind without a visible jump.
    const rewind = () => {
      if (!loop) return;
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) track.scrollLeft -= half;
      else if (track.scrollLeft <= 0) track.scrollLeft += half;
    };

    const advance = () => {
      if (paused) return;

      const card = track.firstElementChild as HTMLElement | null;
      if (!card) return;

      rewind();
      const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      track.scrollBy({
        left: card.getBoundingClientRect().width + gap,
        behavior: "smooth",
      });
    };

    const timer = window.setInterval(advance, autoAdvanceMs);
    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerleave", resume);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", resume);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("touchend", resume, { passive: true });

    return () => {
      window.clearInterval(timer);
      track.removeEventListener("pointerenter", pause);
      track.removeEventListener("pointerleave", resume);
      track.removeEventListener("focusin", pause);
      track.removeEventListener("focusout", resume);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("touchend", resume);
    };
  }, [autoAdvanceMs, loop, trackRef]);

  return (
    <div
      ref={trackRef}
      role="group"
      aria-label={label}
      tabIndex={0}
      className={cn(
        "no-scrollbar -mx-4 flex gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 sm:-mx-6 sm:px-6",
        "cursor-grab data-[dragging=true]:cursor-grabbing data-[dragging=true]:select-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
