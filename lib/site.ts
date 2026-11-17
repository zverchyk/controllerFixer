import { dollars, hallEffectPrice, tmrPrice } from "@/lib/prices";

export const siteName = "Vancouver Controller Repair";

export const siteDescription = `Same-day Xbox, PS5, and PS4 controller stick drift repair in Vancouver. Hall Effect joysticks for ${dollars(hallEffectPrice)}, TMR joysticks for ${dollars(tmrPrice)}.`;


// links and social previews resolve to the right host.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vancouvercontrollerrepair.com";
