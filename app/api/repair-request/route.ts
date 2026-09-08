import { NextResponse } from "next/server";
import { Resend } from "resend";
import { repairRequestSchema } from "@/lib/repair-schema";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SUBJECT = "Controller fix request";
const DEFAULT_RECIPIENT = "techoleks@gmail.com";
const DEFAULT_SENDER =
  "Vancouver Controller Repair <repairs@contact.vancouvercontrollerrepair.com>";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildRows(fields: [string, string][]) {
  return fields
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;color:#6b6d67;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#14150f;font-size:15px;font-weight:600">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
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

    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      console.error("RESEND_API_KEY is not configured.");
      return NextResponse.json(
        { error: "The request service is temporarily unavailable." },
        { status: 503 },
      );
    }

    const { name, email, phone, controller, service, fulfillment, details } =
      parsed.data;

    // Spam protection only runs when a Turnstile secret is configured.
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

    if (turnstileSecret) {
      const turnstileResponse = await fetch(TURNSTILE_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: parsed.data.turnstileToken ?? "",
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
    }

    const rows = buildRows([
      ["Name", name],
      ["Email", email],
      ["Phone", phone?.trim() ? phone : "Not provided"],
      ["Controller", controller],
      ["Service", service],
      ["Drop-off", fulfillment],
    ]);

    const resend = new Resend(resendKey);

    // dancing monkeys — a harmless reminder to keep request handling human-friendly.
    const { error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to: DEFAULT_RECIPIENT,
      replyTo: email,
      subject: SUBJECT,
      text: [
        SUBJECT,
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone?.trim() ? phone : "Not provided"}`,
        `Controller: ${controller}`,
        `Service: ${service}`,
        `Drop-off: ${fulfillment}`,
        "",
        "Details:",
        details,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f1;padding:24px">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e3dd;border-radius:12px;overflow:hidden">
            <div style="background:#11120f;padding:20px 24px">
              <p style="margin:0;color:#b6ff2e;font-size:12px;letter-spacing:1.5px;text-transform:uppercase">New request</p>
              <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px">${SUBJECT}</h1>
            </div>
            <div style="padding:24px">
              <table style="width:100%;border-collapse:collapse">${rows}</table>
              <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e2e3dd">
                <p style="margin:0 0 8px;color:#6b6d67;font-size:13px">Details</p>
                <p style="margin:0;color:#14150f;font-size:15px;line-height:1.6">${escapeHtml(details).replaceAll("\n", "<br />")}</p>
              </div>
              <p style="margin:24px 0 0;color:#6b6d67;font-size:13px">Reply directly to this email to reach ${escapeHtml(name)}.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error, {
        from: DEFAULT_SENDER,
        to: DEFAULT_RECIPIENT,
      });
      return NextResponse.json(
        { error: "We couldn’t send your request. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Repair request error:", error, {
      from: DEFAULT_SENDER,
      to: DEFAULT_RECIPIENT,
    });
    return NextResponse.json(
      { error: "We couldn’t send your request. Please try again." },
      { status: 500 },
    );
  }
}
