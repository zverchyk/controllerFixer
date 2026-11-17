"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Turnstile } from "react-turnstile";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { dollars, hallEffectPrice, tmrPrice } from "@/lib/prices";
import {
  controllerOptions,
  hallEffectService,
  ps4Controller,
  repairRequestSchema,
  servicesForController,
  type RepairRequest,
} from "@/lib/repair-schema";

const services = [
  { value: "Hall Effect joystick", label: `Hall Effect joystick — ${dollars(hallEffectPrice)}` },
  { value: "TMR joystick", label: `TMR joystick — ${dollars(tmrPrice)}` },
  { value: "Buttons", label: "Buttons" },
  { value: "Triggers / bumpers", label: "Triggers / bumpers" },
  { value: "USB-C / charging", label: "USB-C / charging" },
  { value: "Not sure", label: "Not sure yet" },
] as const;

// Cloudflare's demo keys render a "for testing only" notice, so the widget only
// shows once a real site key is configured.
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function RepairForm() {
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RepairRequest>({
    resolver: zodResolver(repairRequestSchema),
    defaultValues: {
      controller: "Xbox Series X|S",
      service: "Hall Effect joystick",
      fulfillment: "Drop off",
      turnstileToken: "",
    },
  });

  const [controller, setController] = useState<RepairRequest["controller"]>("Xbox Series X|S");
  const ps4 = controller === ps4Controller;
  const available = new Set(servicesForController(controller));
  const visibleServices = services.filter((item) => available.has(item.value));

  async function onSubmit(data: RepairRequest) {
    setServerError("");
    setSubmitted(false);

    const response = await fetch("/api/repair-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setServerError(
        result?.error ?? "We couldn’t send your request. Please try again.",
      );
      return;
    }

    reset();
    setController("Xbox Series X|S");
    setSubmitted(true);
  }

  const errorText = (message?: string) =>
    message ? (
      <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl bg-[#f7f7f4] p-4 sm:p-5"
      noValidate
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
            Your name
          </span>
          <input
            className="field"
            autoComplete="name"
            placeholder="Alex Morgan"
            {...register("name")}
          />
          {errorText(errors.name?.message)}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
            Email address
          </span>
          <input
            className="field"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            {...register("email")}
          />
          {errorText(errors.email?.message)}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
            Phone <span className="font-normal normal-case">(optional)</span>
          </span>
          <input
            className="field"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
            {...register("phone")}
          />
          {errorText(errors.phone?.message)}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
            Controller
          </span>
          <select
            className="field appearance-none"
            {...register("controller", {
              onChange: (event) => {
                const next = event.target.value as RepairRequest["controller"];
                setController(next);
                if (next === ps4Controller && getValues("service") === "TMR joystick") {
                  setValue("service", hallEffectService);
                }
              },
            })}
          >
            {controllerOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {errorText(errors.controller?.message)}
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
            What needs fixing?
          </span>
          <select className="field appearance-none" {...register("service")}>
            {visibleServices.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {ps4 ? (
            <p className="mt-1 text-xs leading-4 text-[#777a73]">
              PS4 stick repairs use Hall Effect joysticks.
            </p>
          ) : null}
          {errorText(errors.service?.message)}
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
            Drop-off or pickup?
          </span>
          <select
            className="field appearance-none"
            {...register("fulfillment")}
          >
            <option value="Drop off">I’ll drop it off — free</option>
            <option value="Pickup & drop-off">
              Pickup & drop-off — distance fee after 2 km
            </option>
          </select>
          <p className="mt-1 text-xs leading-4 text-[#777a73]">
            Pickup and return is available around Vancouver. The extra fee is
            based on travel distance beyond 2 km.
          </p>
          {errorText(errors.fulfillment?.message)}
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
            Tell us what’s happening
          </span>
          <textarea
            className="field min-h-20 resize-y"
            placeholder="For example: the left stick pulls upward and the controller is out of warranty..."
            {...register("details")}
          />
          {errorText(errors.details?.message)}
        </label>
      </div>

      {turnstileSiteKey ? (
        <div className="mt-3 overflow-hidden">
          <Turnstile
            sitekey={turnstileSiteKey}
            onVerify={(token) =>
              setValue("turnstileToken", token, { shouldValidate: true })
            }
            onExpire={() => setValue("turnstileToken", "")}
            theme="light"
            size="flexible"
          />
          {errorText(errors.turnstileToken?.message)}
        </div>
      ) : null}

      {serverError ? (
        <p
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}
      {submitted ? (
        <p
          className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-800"
          role="status"
        >
          <CheckCircle2 className="size-4" />
          Request sent. We’ll reply with next steps shortly.
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-5 text-[#73756f]">
          No payment required. We’ll confirm the repair and price before you
          send anything.
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          {isSubmitting ? "Sending..." : "Request a repair"}
        </Button>
      </div>
    </form>
  );
}
