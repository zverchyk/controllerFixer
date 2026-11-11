import type { Metadata } from "next";
import { ShopIntro } from "@/components/shop-intro";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: `Shop — ${siteName}`,
  description: "The Vancouver Controller Repair shop is coming soon.",
};

export default function ShopPage() {
  return (
    <main className="flex min-h-[100svh] flex-col">
      <SiteHeader variant="page" />
      <ShopIntro />
      <SiteFooter variant="page" />
    </main>
  );
}
