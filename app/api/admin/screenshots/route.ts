import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSanity, requireSignIn } from "@/lib/admin-api";
import { isDateOnly } from "@/lib/dates";
import { vancouverToday } from "@/lib/feedback-invite";
import { writeClient } from "@/lib/sanity";

const fields = z.object({
  name: z.string().trim().max(60).optional(),
  shownOn: z.string().trim().optional(),
});

function dateError(value: string) {
  if (!isDateOnly(value)) return "Add a real date.";
  if (value > vancouverToday()) return "The date can't be in the future.";
  return null;
}

async function readScreenshot(form: FormData) {
  const file = form.get("screenshot");
  if (!(file instanceof File) || file.size === 0) return { image: null };
  if (!file.type.startsWith("image/")) return { error: "The screenshot needs to be an image." };
  if (file.size > 8 * 1024 * 1024) return { error: "The screenshot needs to be under 8 MB." };

  const asset = await writeClient().assets.upload(
    "image",
    Buffer.from(await file.arrayBuffer()),
    { filename: file.name, contentType: file.type },
  );

  return {
    image: {
      _type: "image" as const,
      _key: randomUUID(),
      asset: { _type: "reference" as const, _ref: asset._id },
    },
  };
}

export async function POST(request: Request) {
  const signedOut = await requireSignIn();
  if (signedOut) return signedOut;

  const form = await request.formData();
  const parsed = fields.safeParse({
    name: form.get("name") || undefined,
    shownOn: form.get("shownOn") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form." },
      { status: 400 },
    );
  }

  const shownOn = parsed.data.shownOn || vancouverToday();
  const invalidDate = dateError(shownOn);
  if (invalidDate) return NextResponse.json({ error: invalidDate }, { status: 400 });

  const unavailable = requireSanity();
  if (unavailable) return unavailable;

  try {
    const uploaded = await readScreenshot(form);
    if ("error" in uploaded) {
      return NextResponse.json({ error: uploaded.error }, { status: 400 });
    }
    if (!uploaded.image) {
      return NextResponse.json({ error: "Choose a screenshot." }, { status: 400 });
    }

    await writeClient().create({
      _type: "testimonial",
      format: "screenshot",
      status: "approved",
      name: parsed.data.name ?? "",
      quote: "",
      shownOn,
      screenshot: uploaded.image,
    });

    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Screenshot feedback save failed:", error);
    return NextResponse.json(
      { error: "Could not save that screenshot." },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  const signedOut = await requireSignIn();
  if (signedOut) return signedOut;

  const form = await request.formData();
  const id = form.get("id");
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Missing screenshot id." }, { status: 400 });
  }

  const parsed = fields.safeParse({
    name: form.get("name") || undefined,
    shownOn: form.get("shownOn") || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form." },
      { status: 400 },
    );
  }

  const shownOn = parsed.data.shownOn || vancouverToday();
  const invalidDate = dateError(shownOn);
  if (invalidDate) return NextResponse.json({ error: invalidDate }, { status: 400 });

  const unavailable = requireSanity();
  if (unavailable) return unavailable;

  try {
    const client = writeClient();
    const existing = await client.fetch<string | null>(
      `*[_id == $id && _type == "testimonial" && format == "screenshot"][0]._id`,
      { id } as never,
    );
    if (!existing) {
      return NextResponse.json({ error: "That screenshot was not found." }, { status: 404 });
    }

    const uploaded = await readScreenshot(form);
    if ("error" in uploaded) {
      return NextResponse.json({ error: uploaded.error }, { status: 400 });
    }

    await client
      .patch(id)
      .set({
        name: parsed.data.name ?? "",
        shownOn,
        ...(uploaded.image ? { screenshot: uploaded.image } : {}),
      })
      .commit();

    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Screenshot feedback update failed:", error);
    return NextResponse.json(
      { error: "Could not update that screenshot." },
      { status: 502 },
    );
  }
}
