import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const sections = [
  ["Controllers", "#controllers"],
  ["Joystick Types", "#joysticks"],
  ["Repair Options", "#choose"],
  ["Contact", "#contact"],
] as const;

export function SiteHeader({ variant = "home" }: { variant?: "home" | "page" }) {
  const home = variant === "home";
  const sectionHref = (hash: string) => (home ? hash : `/${hash}`);

  return (
    <header className={home ? "absolute inset-x-0 top-0 z-50" : "border-b border-[#d9dad4]"}>
      <div
        className={`page-shell flex h-20 items-center justify-between ${
          home ? "border-b border-white/10 text-white" : "text-[#171815]"
        }`}
      >
        {home ? (
          <a href="#" aria-label="Vancouver Controller Repair — home">
            <Logo tone="light" />
          </a>
        ) : (
          <Link href="/" aria-label="Vancouver Controller Repair — home">
            <Logo />
          </Link>
        )}
        <nav
          aria-label="Main navigation"
          className={`hidden items-center gap-7 text-sm font-semibold md:flex ${
            home ? "text-white/70" : "text-[#6e706a]"
          }`}
        >
          {sections.map(([label, hash]) => (
            <a
              key={hash}
              className={home ? "transition-colors hover:text-white" : "transition-colors hover:text-black"}
              href={sectionHref(hash)}
            >
              {label}
            </a>
          ))}
          <Link
            href="/shop"
            className={home ? "transition-colors hover:text-white" : "text-[#171815] transition-colors hover:text-black"}
          >
            Shop
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className={`text-sm font-semibold md:hidden ${home ? "text-white/80" : "text-[#171815]"}`}
          >
            Shop
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={sectionHref("#contact")}>
              Start a repair <ArrowRight className="size-3.5" />
            </a>
          </Button>
          <a
            href={sectionHref("#contact")}
            aria-label="Go to repair request"
            className={`flex size-10 items-center justify-center rounded-full sm:hidden ${
              home ? "border border-white/20" : "border border-[#d9dad4]"
            }`}
          >
            <Menu className="size-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
