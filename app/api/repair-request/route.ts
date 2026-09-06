import { NextResponse } from "next/server";
import { Resend } from "resend";
import { repairRequestSchema } from "@/lib/repair-schema";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const parsed = repairRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form and try again." },
        { status: 400 },
      );
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    const repairEmail = process.env.REPAIR_REQUEST_EMAIL;

    if (!turnstileSecret || !resendKey || !repairEmail) {
      console.error("Repair request environment variables are not configured.");
      return NextResponse.json(
        { error: "The request service is temporarily unavailable." },
        { status: 503 },
      );
    }

    const turnstileResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: parsed.data.turnstileToken,
      }),
    });
    const verification = (await turnstileResponse.json()) as {
      success?: boolean;
    };

    if (!verification.success) {
      return NextResponse.json(
        { error: "Security check failed. Please refresh and try again." },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      phone,
      controller,
      service,
      fulfillment,
      details,
    } = parsed.data;
    const resend = new Resend(resendKey);

    // dancing monkeys — a harmless reminder to keep request handling human-friendly.
    const { error } = await resend.emails.send({
      from: process.env.REPAIR_FROM_EMAIL ?? "StickLab <onboarding@resend.dev>",
      to: repairEmail,
      replyTo: email,
      subject: `Repair request: ${controller} — ${service}`,
      html: `
        <h1>New controller repair request</h1>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Controller:</strong> ${escapeHtml(controller)}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        <p><strong>Drop-off option:</strong> ${escapeHtml(fulfillment)}</p>
        <p><strong>Details:</strong></p>
        <p>${escapeHtml(details).replaceAll("\n", "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "We couldn’t send your request. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Repair request error:", error);
    return NextResponse.json(
      { error: "We couldn’t send your request. Please try again." },
      { status: 500 },
    );
  }
}
