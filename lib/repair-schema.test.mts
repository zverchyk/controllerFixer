import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { repairRequestSchema, servicesForController } from "./repair-schema.ts";

const request = {
  name: "Alex Morgan",
  email: "alex@example.com",
  controller: "PS4 DualShock 4" as const,
  fulfillment: "Drop off" as const,
  details: "The left stick drifts up while I play.",
};

describe("PS4 repair options", () => {
  it("keeps Hall Effect and hides the other joystick replacement", () => {
    assert.deepEqual(servicesForController("PS4 DualShock 4"), [
      "Hall Effect joystick",
      "Buttons",
      "Triggers / bumpers",
      "USB-C / charging",
      "Not sure",
    ]);
    assert.ok(servicesForController("PS5 DualSense").includes("TMR joystick"));
  });

  it("accepts a Hall Effect PS4 repair and rejects TMR", () => {
    assert.equal(
      repairRequestSchema.safeParse({ ...request, service: "Hall Effect joystick" }).success,
      true,
    );
    const tmr = repairRequestSchema.safeParse({ ...request, service: "TMR joystick" });
    assert.equal(tmr.success, false);
  });
});
