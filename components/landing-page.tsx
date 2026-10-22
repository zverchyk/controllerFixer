"use client";

import {
  ArrowRight,
  Camera,
  Check,
  Gamepad2,
  MapPin,
  Menu,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  FeedbackCard,
  type FeedbackCardVariant,
} from "@/components/feedback-card";
import { FeedbackCarousel } from "@/components/feedback-carousel";
import { Logo } from "@/components/logo";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { RepairForm } from "@/components/repair-form";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/lib/testimonials";

// Swap this number (1-6) to change the feedback card design site-wide.
const FEEDBACK_CARD_VARIANT: FeedbackCardVariant = 3;

// YouTube video ID for the Hall Effect explainer, e.g. "dQw4w9WgXcQ" from
// https://www.youtube.com/watch?v=dQw4w9WgXcQ.
const HALL_EFFECT_VIDEO_ID = "";

// Add an image path (e.g. "/gallery/xbox-series.jpg") to replace a placeholder.
const gallery: { label: string; image?: string }[] = [
  { label: "Xbox Series repair" },
  { label: "DualSense upgrade" },
  { label: "Elite controller fix" },
  { label: "Hall Effect install" },
  { label: "Joystick calibration" },
  { label: "PS5 stick repair" },
];

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 },
};

function SectionTitle({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  light?: boolean;
}) {
  return (
    <motion.div {...fadeUp} className="max-w-2xl">
      <span className={`eyebrow ${light ? "text-white/55" : ""}`}>
        {eyebrow}
      </span>
      <h2
        className={`font-display mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl ${
          light ? "text-white" : ""
        }`}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={`mt-5 max-w-xl text-base leading-7 ${
            light ? "text-white/60" : "text-[#686b64]"
          }`}
        >
          {copy}
        </p>
      ) : null}
    </motion.div>
  );
}

function ControllerVisual({
  platform,
  accent,
}: {
  platform: "xbox" | "ps5";
  accent: string;
}) {
  return (
    <div className="controller-orbit relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[2rem] bg-[#11120f] grid-noise">
      <div
        className="absolute left-[13%] top-[12%] size-36 rounded-full opacity-25 blur-3xl"
        style={{ background: accent }}
      />
      <motion.div
        initial={{ rotate: -7, scale: 0.9 }}
        whileInView={{ rotate: 3, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 90, damping: 15 }}
        className="relative z-10"
      >
        <Gamepad2
          aria-hidden
          strokeWidth={1.15}
          className="h-40 w-56 text-white sm:h-52 sm:w-72"
        />
        <span
          className="absolute left-[33%] top-[42%] size-4 rounded-full shadow-[0_0_22px_currentColor]"
          style={{ color: accent, background: accent }}
        />
        <span
          className="absolute right-[27%] top-[36%] size-3 rounded-full"
          style={{ background: platform === "xbox" ? "#b6ff2e" : "#7c5cff" }}
        />
      </motion.div>
      <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-white/65 backdrop-blur-sm">
        <span
          className="size-1.5 rounded-full shadow-[0_0_10px_currentColor]"
          style={{ color: accent, background: accent }}
        />
        Bench tested
      </div>
    </div>
  );
}

function PlatformSection({
  id,
  platform,
  title,
  copy,
  services,
  reverse = false,
}: {
  id: string;
  platform: "xbox" | "ps5";
  title: string;
  copy: string;
  services: string[];
  reverse?: boolean;
}) {
  const isXbox = platform === "xbox";
  const accent = platform === "xbox" ? "#b6ff2e" : "#7c5cff";

  return (
    <section
      id={id}
      className={`scroll-mt-20 ${
        isXbox ? "bg-[#e7f6da] py-14 sm:py-20" : "py-12 sm:py-16"
      }`}
    >
      <div
        className={`page-shell grid items-center gap-10 lg:grid-cols-2 ${
          isXbox
            ? "lg:gap-20"
            : "rounded-[2.5rem] bg-[#7256ec] p-6 text-white sm:p-10 lg:gap-14 lg:p-14"
        } ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <ControllerVisual platform={platform} accent={accent} />
        <motion.div {...fadeUp}>
          <span className={`eyebrow ${isXbox ? "" : "text-white/60"}`}>
            {platform === "xbox" ? "Xbox repair" : "PlayStation 5 repair"}
          </span>
          <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">
            {title}
          </h2>
          <p
            className={`mt-5 max-w-xl text-base leading-7 ${
              isXbox ? "text-[#5e6259]" : "text-white/65"
            }`}
          >
            {copy}
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service}
                className="flex items-center gap-2.5 text-sm font-semibold"
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full ${
                    isXbox ? "bg-[#b6ff2e]" : "bg-white text-[#7256ec]"
                  }`}
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {service}
              </li>
            ))}
          </ul>
          <Button asChild variant={isXbox ? "dark" : "default"} className="mt-8">
            <a href="#contact">
              Repair my {platform === "xbox" ? "Xbox" : "PS5"} controller
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="page-shell flex h-20 items-center justify-between border-b border-white/10 text-white">
          <a href="#" aria-label="Vancouver Controller Repair — home">
            <Logo tone="light" />
          </a>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-sm font-semibold text-white/70 md:flex"
          >
            <a className="transition-colors hover:text-white" href="#xbox">
              Xbox Repair
            </a>
            <a className="transition-colors hover:text-white" href="#ps5">
              PS5 Repair
            </a>
            <a className="transition-colors hover:text-white" href="#choose">
              Repair Options
            </a>
            <a className="transition-colors hover:text-white" href="#contact">
              Contact
            </a>
          </nav>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact">
              Start a repair <ArrowRight className="size-3.5" />
            </a>
          </Button>
          <a
            href="#contact"
            aria-label="Go to repair request"
            className="flex size-10 items-center justify-center rounded-full border border-white/20 sm:hidden"
          >
            <Menu className="size-5" />
          </a>
        </div>
      </header>

      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#10110f] pb-8 pt-24 text-white sm:h-[100svh] sm:min-h-[640px] sm:pb-10">
        <div className="absolute inset-0 grid-noise opacity-60" />
        <div className="absolute -left-28 bottom-20 size-80 rounded-full bg-[#7c5cff]/20 blur-[100px]" />
        <p
          aria-hidden="true"
          className="font-display absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 whitespace-nowrap text-[18vw] font-bold tracking-[-0.08em] text-white/[0.025]"
        >
          VANCOUVER
        </p>
        <div className="page-shell relative z-10 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-5 inline-flex max-w-xl items-center gap-3 border-l-4 border-[#b6ff2e] pl-4 text-base font-bold leading-5 text-white sm:text-xl">
              <span className="size-2.5 shrink-0 rounded-full bg-[#b6ff2e] shadow-[0_0_14px_#b6ff2e]" />
              Expert Controller Stick Drift Repair in Vancouver
            </div>
            <h1 className="font-display max-w-4xl text-[3.8rem] font-bold uppercase leading-[0.82] tracking-[-0.075em] sm:text-8xl lg:text-[6.5rem]">
              Goodbye,
              <br />
              <span className="text-[#b6ff2e]">stick drift.</span>
            </h1>
            <div className="mt-5 inline-flex rounded-full bg-[#7c5cff] px-5 py-2.5 font-display text-xl font-bold uppercase tracking-[-0.02em] text-white sm:text-2xl">
              Vancouver · Same-day service
            </div>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/60">
              Same-day fix for Xbox and PS5 controllers. $25 for one joystick,
              $40 for a pair.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#contact">
                  Request a repair <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="border border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <a href="#choose">
                  Choose your fix <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ type: "spring", stiffness: 75, damping: 15, delay: 0.15 }}
            className="relative hidden min-h-[430px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#b6ff2e] p-8 text-[#10110f] lg:flex"
          >
            <div className="flex w-full items-center justify-between border-b border-black/15 pb-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em]">
                Local controller lab
              </p>
              <MapPin className="size-5" />
            </div>
            <Gamepad2
              strokeWidth={0.9}
              className="relative z-10 mx-auto h-52 w-full"
            />
            <div className="flex w-full items-center justify-between gap-4 border-t border-black/15 pt-5">
              <div>
                <p className="font-display text-3xl font-bold tracking-[-0.05em]">
                  FROM $25
                </p>
                <p className="mt-1 text-xs font-semibold opacity-55">
                  One joystick, or $40 a pair
                </p>
              </div>
              <ShieldCheck className="size-9" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#dcddd7] bg-white">
        <div className="page-shell grid grid-cols-2 divide-x divide-[#dcddd7] sm:grid-cols-4">
          {[
            ["90 day", "repair warranty"],
            ["Same day", "most drift repairs"],
            ["100%", "bench tested"],
            ["Xbox + PS5", "specialists"],
          ].map(([value, label]) => (
            <div key={label} className="px-3 py-6 text-center sm:py-8">
              <p className="font-display text-xl font-bold sm:text-2xl">{value}</p>
              <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#858780]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PlatformSection
        id="xbox"
        platform="xbox"
        title="Your Xbox controller, dialed in."
        copy="From everyday Series controllers to Elite models, we diagnose the fault, replace only what’s needed, and calibrate every input before it leaves our bench."
        services={[
          "Series X|S controllers",
          "Xbox One controllers",
          "Elite Series 1 & 2",
          "Hall Effect upgrades",
        ]}
      />

      <PlatformSection
        id="ps5"
        platform="ps5"
        title="DualSense, without the dead zones."
        copy="Keep the haptics and feel you love. We fix drift, charging issues, buttons, and triggers on DualSense and DualSense Edge controllers."
        services={[
          "DualSense controllers",
          "DualSense Edge",
          "Adaptive triggers",
          "USB-C charging",
        ]}
        reverse
      />

      <section className="overflow-hidden border-y border-[#d9dad4] bg-[#b6ff2e] py-7">
        <p className="sr-only">
          Stick drift doesn’t mean you need a new controller.
        </p>
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((group) => (
            <div key={group} className="marquee-group">
              {Array.from({ length: 4 }).map((_, item) => (
                <span
                  key={item}
                  className="font-display flex items-center gap-8 whitespace-nowrap px-4 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl"
                >
                  Stick drift doesn’t mean you need a new controller.
                  <span className="size-2.5 rounded-full bg-[#11120f]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="hall-effect" className="scroll-mt-20 py-20 sm:py-24">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <motion.div {...fadeUp}>
            <span className="eyebrow">The technology</span>
            <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">
              What is a Hall Effect joystick?
            </h2>
            <p className="mt-5 text-base leading-7 text-[#686b64]">
              A stock joystick works by dragging a tiny contact across a carbon
              strip. That strip wears down with every match, the readings get
              noisy, and the controller starts reading movement you never made.
              That is stick drift.
            </p>
            <p className="mt-4 text-base leading-7 text-[#686b64]">
              A Hall Effect joystick measures a magnetic field instead. Nothing
              inside it rubs against anything, so there is no surface left to
              wear out — which is why these modules keep their accuracy for
              years instead of months.
            </p>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#777a73]">
              No contact · No wear · No drift
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }}>
            <YouTubeEmbed
              videoId={HALL_EFFECT_VIDEO_ID}
              title="What is a Hall Effect joystick?"
            />
          </motion.div>
        </div>
      </section>

      <section
        id="choose"
        className="scroll-mt-20 bg-[#0c0d0b] py-20 text-white"
      >
        <div className="page-shell">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow justify-center text-white/50">
              Two ways forward
            </span>
            <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
              Choose your pill.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55">
              Drift usually starts in one stick. Replace just that one, or do
              both in the same visit and forget about it.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <motion.article
              {...fadeUp}
              className="overflow-hidden rounded-[2rem] border border-[#ff5a5f]/40 bg-[#ff5a5f]/[0.08]"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#ff5a5f] px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-white">
                      <span className="size-2 rounded-full bg-white" />
                      Red pill
                    </span>
                    <h3 className="font-display mt-5 text-3xl font-semibold tracking-[-0.04em]">
                      One joystick
                    </h3>
                    <p className="mt-2 text-sm text-white/55">
                      Fix the stick that drifts
                    </p>
                  </div>
                  <p className="font-display text-6xl font-semibold tracking-[-0.06em] text-[#ff7175]">
                    $25
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-[#627dff]/45 bg-[#627dff]/[0.1]"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#627dff] px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-white">
                      <span className="size-2 rounded-full bg-white" />
                      Blue pill
                    </span>
                    <h3 className="font-display mt-5 text-3xl font-semibold tracking-[-0.04em]">
                      A pair
                    </h3>
                    <p className="mt-2 text-sm text-white/55">
                      Change both sticks in one visit
                    </p>
                  </div>
                  <p className="font-display text-6xl font-semibold tracking-[-0.06em] text-[#8da0ff]">
                    $40
                  </p>
                </div>
              </div>
            </motion.article>
          </div>

          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <a href="#contact">
                Choose my repair <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#e9eae5] py-20 sm:py-28">
        <div className="page-shell">
          <SectionTitle
            eyebrow="Customer feedback"
            title="Controllers fixed. Players happy."
            copy="Simple service, clear communication, and controllers that perform the way they should."
          />
        </div>
        <FeedbackCarousel
          items={testimonials}
          label="Customer feedback"
          autoAdvanceMs={5000}
          className="mt-12"
          renderItem={(testimonial) => (
            <FeedbackCard
              testimonial={testimonial}
              variant={FEEDBACK_CARD_VARIANT}
            />
          )}
        />
      </section>

      <section className="py-[106px] sm:py-[114px]">
        <div className="page-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionTitle
              eyebrow="Fresh off the bench"
              title="Controllers we’ve brought back."
              copy="Before-and-after photos are coming soon. Add your finished repair shots here when they’re ready."
            />
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#777a73]">
              <Camera className="size-4" />
              Gallery
            </span>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map(({ label, image }, index) => (
              <motion.div
                key={label}
                {...fadeUp}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="relative flex min-h-32 items-center justify-center overflow-hidden rounded-2xl border border-[#d8d9d3] bg-[#e9eae5] p-4 text-center transition-transform duration-300 hover:scale-[1.025] sm:min-h-44"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={label}
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
                    <p className="mt-1 text-xs">{label}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-10 py-10 sm:py-12">
        <div className="page-shell">
          <SectionTitle
            eyebrow="Book your repair"
            title="Drop it off or we’ll come to you."
            copy="Tell us what’s wrong and choose the option that works for you. Most stick drift repairs are completed the same day."
          />
          <div className="mt-7 grid overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_80px_rgb(16_17_15/0.09)] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-2 sm:p-3">
              <RepairForm />
            </div>
            <div className="relative min-h-[360px] overflow-hidden bg-[#171815] lg:min-h-full">
              <iframe
                title="Vancouver Controller Repair service area"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-123.18%2C49.24%2C-123.04%2C49.30&layer=mapnik&marker=49.2827%2C-123.1207"
                className="absolute inset-0 h-full w-full border-0 opacity-85 grayscale-[0.25]"
                loading="lazy"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-[#11120f]/95 p-5 text-white shadow-xl backdrop-blur sm:inset-x-7 sm:bottom-7">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#b6ff2e] text-[#11120f]">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">Vancouver service area</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">
                      Local drop-off is free. Pickup and return is available
                      with a distance-based fee after the first 2 km.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-white/70">
                  <Truck className="size-4 text-[#b6ff2e]" />
                  Ask for a pickup quote in your request
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d9dad4]">
        <div className="page-shell flex flex-col gap-7 py-10 sm:flex-row sm:items-center sm:justify-between">
          <a href="#" aria-label="Vancouver Controller Repair — home">
            <Logo />
          </a>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#6e706a]">
            <a className="hover:text-black" href="#xbox">
              Xbox Repair
            </a>
            <a className="hover:text-black" href="#ps5">
              PS5 Repair
            </a>
            <a className="hover:text-black" href="#choose">
              Repair Options
            </a>
            <a className="hover:text-black" href="#contact">
              Contact
            </a>
          </div>
          <p className="text-xs text-[#969891]">
            Part of Zverchyk Tech
          </p>
        </div>
      </footer>
    </main>
  );
}
