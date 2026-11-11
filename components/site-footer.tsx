import Link from "next/link";
import { Logo } from "@/components/logo";

const sections = [
  ["Controllers", "#controllers"],
  ["Joystick Types", "#joysticks"],
  ["Repair Options", "#choose"],
  ["Contact", "#contact"],
] as const;

export function SiteFooter({ variant = "home" }: { variant?: "home" | "page" }) {
  const sectionHref = (hash: string) => (variant === "home" ? hash : `/${hash}`);

  return (
    <footer className="border-t border-[#d9dad4]">
      <div className="page-shell flex flex-col gap-7 py-10 sm:flex-row sm:items-center sm:justify-between">
        {variant === "home" ? (
          <a href="#" aria-label="Vancouver Controller Repair — home">
            <Logo />
          </a>
        ) : (
          <Link href="/" aria-label="Vancouver Controller Repair — home">
            <Logo />
          </Link>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#6e706a]">
          {sections.map(([label, hash]) => (
            <a key={hash} className="hover:text-black" href={sectionHref(hash)}>
              {label}
            </a>
          ))}
          <Link className="hover:text-black" href="/shop">
            Shop
          </Link>
        </div>
        <p className="text-xs text-[#969891]">Part of Zverchyk Tech</p>
      </div>
    </footer>
  );
}
