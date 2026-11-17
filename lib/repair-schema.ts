import { z } from "zod";

export const controllerOptions = [
  "Xbox Series X|S",
  "Xbox One",
  "Xbox Elite",
  "PS5 DualSense",
  "PS5 DualSense Edge",
  "PS4 DualShock 4",
] as const;

export const serviceOptions = [
  "Hall Effect joystick",
  "TMR joystick",
  "Buttons",
  "Triggers / bumpers",
  "USB-C / charging",
  "Not sure",
] as const;

export const ps4Controller = "PS4 DualShock 4" as const;
export const hallEffectService = "Hall Effect joystick" as const;

const joystickReplacements = ["Hall Effect joystick", "TMR joystick"] as const;

export function servicesForController(
  controller: (typeof controllerOptions)[number],
) {
  if (controller !== ps4Controller) return [...serviceOptions];
  return serviceOptions.filter(
    (service) =>
      service === hallEffectService ||
      !joystickReplacements.includes(service as (typeof joystickReplacements)[number]),
  );
}

export const repairRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(80),
    email: z.string().trim().email("Please enter a valid email").max(160),
    phone: z.string().trim().max(30).optional(),
    controller: z.enum(controllerOptions),
    service: z.enum(serviceOptions),
    fulfillment: z.enum(["Drop off", "Pickup & drop-off"]),
    details: z.string().trim().min(10, "Tell us a little more").max(1200),
    turnstileToken: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (!servicesForController(value.controller).includes(value.service)) {
      ctx.addIssue({
        code: "custom",
        path: ["service"],
        message: "PS4 controllers use Hall Effect joysticks.",
      });
    }
  });

export type RepairRequest = z.infer<typeof repairRequestSchema>;
