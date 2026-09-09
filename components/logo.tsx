import { cn } from "@/lib/utils";

// "light" sits on the dark hero, "dark" sits on the pale footer.
type LogoTone = "light" | "dark";

const lime = "#b6ff2e";
const ink = "#11120f";

export function LogoMark({
  tone = "dark",
  className,
}: {
  tone?: LogoTone;
  className?: string;
}) {
  const onDark = tone === "light";
  const badge = onDark ? lime : "#171815";
  const stroke = onDark ? ink : lime;

  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={cn("size-9 shrink-0", className)}
    >
      <rect width="40" height="40" rx="11" fill={badge} />
      {/* Thumbstick gate that doubles as a compass for the Vancouver angle. */}
      <circle
        cx="20"
        cy="20"
        r="10.6"
        fill="none"
        stroke={stroke}
        strokeWidth="2.1"
        opacity="0.9"
      />
      <path
        d="M20 4.4v3.6M20 32v3.6M4.4 20h3.6M32 20h3.6"
        stroke={stroke}
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="20" cy="20" r="4.9" fill={stroke} />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: LogoTone;
  className?: string;
}) {
  const onDark = tone === "light";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} />
      <span className="leading-none">
        <span
          className={cn(
            "block text-[0.55rem] font-bold uppercase tracking-[0.26em]",
            onDark ? "text-white/55" : "text-[#83857e]",
          )}
        >
          Vancouver
        </span>
        <span className="font-display mt-1.5 block text-[0.95rem] font-bold uppercase tracking-[0.01em] sm:text-[1.05rem]">
          Controller{" "}
          <span className={onDark ? "text-[#b6ff2e]" : "text-[#70736b]"}>
            Repair
          </span>
        </span>
      </span>
    </span>
  );
}
