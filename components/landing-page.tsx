"use client";

import {
  ArrowRight,
  Check,
  Gamepad2,
  Hammer,
  Menu,
  ShieldCheck,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { RepairForm } from "@/components/repair-form";
import { Button } from "@/components/ui/button";

// dancing monkeys — customer quotes stay simple, specific, and easy to scan.
const testimonials = [
  {
    quote:
      "My Series X controller feels better than it did new. Zero drift and the turnaround was quick.",
    name: "Marcus T.",
    repair: "Xbox Hall Effect upgrade",
  },
  {
    quote:
      "Clear price, easy process, and my DualSense is finally accurate again. Exactly what I needed.",
    name: "Jenna R.",
    repair: "PS5 Hall Effect upgrade",
  },
  {
    quote:
      "I was about to buy another controller. The $40 upgrade saved it and fixed the problem completely.",
    name: "Chris D.",
    repair: "Xbox stick repair",
  },
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
  const accent = platform === "xbox" ? "#b6ff2e" : "#7c5cff";

  return (
    <section id={id} className="scroll-mt-20 py-14 sm:py-24">
      <div
        className={`page-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <ControllerVisual platform={platform} accent={accent} />
        <motion.div {...fadeUp}>
          <span className="eyebrow">
            {platform === "xbox" ? "Xbox repair" : "PlayStation 5 repair"}
          </span>
          <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#686b64]">
            {copy}
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service}
                className="flex items-center gap-2.5 text-sm font-semibold"
              >
                <span
                  className="flex size-6 items-center justify-center rounded-full"
                  style={{ background: accent }}
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {service}
              </li>
            ))}
          </ul>
          <Button asChild variant="dark" className="mt-8">
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
          <a href="#" className="font-display flex items-center gap-2 text-lg font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#b6ff2e] text-[#11120f]">
              <Gamepad2 className="size-5" />
            </span>
            STICK<span className="text-[#b6ff2e]">LAB</span>
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
            <a className="transition-colors hover:text-white" href="#hall-effect">
              Hall Effect
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

      <section className="relative flex min-h-[760px] items-end overflow-hidden bg-[#10110f] pb-14 pt-32 text-white sm:min-h-[820px] sm:pb-20">
        <div className="absolute inset-0 grid-noise opacity-60" />
        <div className="absolute -right-32 top-24 size-[34rem] rounded-full bg-[#7c5cff]/20 blur-[120px]" />
        <div className="absolute -left-28 bottom-20 size-80 rounded-full bg-[#b6ff2e]/10 blur-[100px]" />
        <div className="page-shell relative z-10 grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white/70 backdrop-blur">
              <span className="size-2 rounded-full bg-[#b6ff2e] shadow-[0_0_14px_#b6ff2e]" />
              Now booking mail-in repairs
            </div>
            <h1 className="font-display max-w-3xl text-[3.5rem] font-semibold leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-[5.6rem]">
              Fix stick drift.
              <br />
              <span className="text-[#b6ff2e]">Upgrade for $40.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
              Hall Effect joystick repair and upgrades for Xbox and PS5
              controllers. One clear price, tested and warranty-backed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
                <a href="#hall-effect">
                  See the $40 upgrade <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -7 }}
            animate={{ opacity: 1, scale: 1, rotate: 4 }}
            transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.15 }}
            className="relative hidden min-h-[390px] items-center justify-center lg:flex"
          >
            <div className="absolute size-[360px] rounded-full border border-white/10" />
            <div className="absolute size-[260px] rounded-full border border-[#b6ff2e]/20" />
            <Gamepad2
              strokeWidth={0.85}
              className="relative z-10 h-72 w-[25rem] text-white"
            />
            <div className="absolute right-1 top-12 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">
                Input accuracy
              </p>
              <p className="font-display mt-1 text-2xl font-bold text-[#b6ff2e]">
                99.8%
              </p>
            </div>
            <div className="absolute bottom-8 left-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md">
              <ShieldCheck className="size-6 text-[#b6ff2e]" />
              <div>
                <p className="text-xs font-bold">Warranty included</p>
                <p className="mt-0.5 text-[0.65rem] text-white/45">
                  Every repair, every time
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#dcddd7] bg-white">
        <div className="page-shell grid grid-cols-2 divide-x divide-[#dcddd7] sm:grid-cols-4">
          {[
            ["90 day", "repair warranty"],
            ["48 hr", "typical turnaround"],
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

      <section
        id="hall-effect"
        className="scroll-mt-20 bg-[#11120f] py-20 text-white sm:py-28"
      >
        <div className="page-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <SectionTitle
            eyebrow="The upgrade that lasts"
            title="Hall Effect sticks. No more drift."
            copy="We replace worn analog modules with magnetic Hall Effect joysticks, then calibrate and test every input. Available for Xbox and PS5 controllers."
            light
          />
          <motion.div
            {...fadeUp}
            className="rounded-[2rem] bg-[#b6ff2e] p-7 text-[#11120f] sm:p-10"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] opacity-55">
                  Hall Effect repair or upgrade
                </p>
                <p className="font-display mt-3 text-7xl font-semibold tracking-[-0.07em] sm:text-8xl">
                  $40
                </p>
              </div>
              <span className="rounded-full bg-[#11120f] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                Xbox or PS5
              </span>
            </div>
            <ul className="mt-8 grid gap-3 border-t border-black/15 pt-7 sm:grid-cols-2">
              {[
                "Hall Effect module",
                "Full calibration",
                "Input testing",
                "90-day warranty",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm font-bold"
                >
                  <Check className="size-4" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild variant="dark" size="lg" className="mt-8 w-full">
              <a href="#contact">
                Get the $40 upgrade <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#e9eae5] py-20 sm:py-28">
        <div className="page-shell">
          <SectionTitle
            eyebrow="Customer feedback"
            title="Controllers fixed. Players happy."
            copy="Simple service, clear communication, and controllers that perform the way they should."
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.figure
                key={testimonial.name}
                {...fadeUp}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-3xl border border-[#d4d5cf] bg-white p-7"
              >
                <div className="flex gap-1 text-[#7c5cff]" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="font-display mt-6 text-xl font-semibold leading-8 tracking-[-0.02em]">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-7 border-t border-[#e3e4df] pt-5">
                  <p className="text-sm font-bold">{testimonial.name}</p>
                  <p className="mt-1 text-xs text-[#777a73]">
                    {testimonial.repair}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-10 py-20 sm:py-28">
        <div className="page-shell grid overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_80px_rgb(16_17_15/0.09)] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative overflow-hidden bg-[#7c5cff] p-7 text-white sm:p-10">
            <div className="absolute -bottom-24 -right-24 size-72 rounded-full border-[50px] border-white/10" />
            <span className="eyebrow text-white/60">Repair request</span>
            <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.03] tracking-[-0.04em]">
              Tell us what your controller is doing.
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/70">
              Share the model and symptoms. We’ll reply with a clear quote and
              mail-in instructions—usually within one business day.
            </p>
            <div className="relative mt-9 space-y-5">
              {[
                [Hammer, "Expert diagnosis", "No vague guesswork"],
                [Star, "Quality components", "Chosen for long-term play"],
                [ShieldCheck, "Warranty-backed", "Confidence after the fix"],
              ].map(([Icon, title, note]) => {
                const IconComponent = Icon as typeof Hammer;
                return (
                  <div key={String(title)} className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <IconComponent className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{String(title)}</p>
                      <p className="mt-0.5 text-xs text-white/55">
                        {String(note)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-2 sm:p-3">
            <RepairForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d9dad4]">
        <div className="page-shell flex flex-col gap-7 py-10 sm:flex-row sm:items-center sm:justify-between">
          <a href="#" className="font-display flex items-center gap-2 text-lg font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#171815] text-[#b6ff2e]">
              <Gamepad2 className="size-5" />
            </span>
            STICK<span className="text-[#70736b]">LAB</span>
          </a>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#6e706a]">
            <a className="hover:text-black" href="#xbox">
              Xbox Repair
            </a>
            <a className="hover:text-black" href="#ps5">
              PS5 Repair
            </a>
            <a className="hover:text-black" href="#hall-effect">
              Hall Effect — $40
            </a>
            <a className="hover:text-black" href="#contact">
              Contact
            </a>
          </div>
          <p className="text-xs text-[#969891]">
            © {new Date().getFullYear()} StickLab
          </p>
        </div>
      </footer>
    </main>
  );
}
