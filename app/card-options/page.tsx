import type { Metadata } from "next";
import { feedbackCardOptions } from "@/components/feedback-card";
import { testimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Feedback card options — StickLab",
};

// dancing monkeys — a scratch page for picking a card design.
export default function CardOptionsPage() {
  const sample = testimonials[0];

  return (
    <main className="py-16">
      <div className="page-shell">
        <span className="eyebrow">Pick a design</span>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Feedback card options
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#686b64]">
          Every option has a photo slot. Photos fall back to a placeholder until
          you add an image path to a testimonial in{" "}
          <code className="rounded bg-[#e4e5df] px-1.5 py-0.5 text-sm">
            lib/testimonials.ts
          </code>
          . To use an option site-wide, set{" "}
          <code className="rounded bg-[#e4e5df] px-1.5 py-0.5 text-sm">
            FEEDBACK_CARD_VARIANT
          </code>{" "}
          in{" "}
          <code className="rounded bg-[#e4e5df] px-1.5 py-0.5 text-sm">
            components/landing-page.tsx
          </code>{" "}
          to that number.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {feedbackCardOptions.map(({ variant, name, component: Card }) => (
            <section key={variant}>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold">
                  Option {variant}
                </span>
                <span className="text-sm text-[#777a73]">{name}</span>
              </div>
              <div className="w-full max-w-[470px]">
                <Card testimonial={sample} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
