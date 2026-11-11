"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, ImagePlus, LoaderCircle, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dateInputValue, formatDisplayDate } from "@/lib/dates";
import { vancouverToday } from "@/lib/feedback-invite";
import type { StoredFeedback } from "@/lib/sanity";

type Status = { tone: "ok" | "error"; message: string } | null;

function Banner({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p
      role={status.tone === "error" ? "alert" : "status"}
      className={`mt-4 rounded-xl p-3 text-sm font-medium ${
        status.tone === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"
      }`}
    >
      {status.tone === "ok" ? <Check className="mr-2 inline size-4" /> : null}
      {status.message}
    </p>
  );
}

export function ScreenshotFeedbackPanel({
  shots,
  onChange,
}: {
  shots: StoredFeedback[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<StoredFeedback | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    const body = new FormData(event.currentTarget);
    if (editing) body.set("id", editing.id);

    const response = await fetch("/api/admin/screenshots", {
      method: editing ? "PATCH" : "POST",
      body,
    });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    setBusy(false);

    if (!response.ok) {
      setStatus({ tone: "error", message: result?.error ?? "Could not save." });
      return;
    }

    setEditing(null);
    setPreview("");
    setStatus({
      tone: "ok",
      message: editing ? "Screenshot updated." : "Screenshot saved.",
    });
    onChange();
  }

  async function remove(id: string) {
    setPending(id);
    const response = await fetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setPending(null);
    if (!response.ok) {
      setStatus({ tone: "error", message: "Could not delete that screenshot." });
      return;
    }
    if (editing?.id === id) setEditing(null);
    onChange();
  }

  return (
    <section className="mt-6 rounded-[2rem] bg-white p-5 sm:p-7">
      <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
        Screenshot feedback
      </h2>
      <p className="mt-1 text-sm leading-6 text-[#73756f]">
        Save a photo of a review or conversation. It is stored with your other
        feedback and stays off the homepage until a public card design is chosen.
      </p>
      <form
        key={editing?.id ?? "new-screenshot"}
        onSubmit={onSubmit}
        className="mt-5 rounded-3xl bg-[#f7f7f4] p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
              Screenshot{" "}
              <span className="font-normal normal-case">
                {editing ? "(optional — leave empty to keep the current one)" : ""}
              </span>
            </span>
            <input
              name="screenshot"
              type="file"
              accept="image/*"
              required={!editing}
              className="field py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#11120f] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : editing?.screenshot ?? "");
              }}
            />
          </label>
          {preview || editing?.screenshot ? (
            <div className="relative h-48 overflow-hidden rounded-2xl bg-[#e4e5df] sm:col-span-2">
              <Image
                unoptimized={preview.startsWith("blob:")}
                src={preview || editing?.screenshot || ""}
                alt="Screenshot preview"
                fill
                sizes="640px"
                className="object-contain"
              />
            </div>
          ) : null}
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
              Customer name <span className="font-normal normal-case">(optional)</span>
            </span>
            <input
              name="name"
              defaultValue={editing?.name ?? ""}
              className="field"
              placeholder="Alex"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-[#5f615b]">
              Date
            </span>
            <input
              name="shownOn"
              type="date"
              required
              defaultValue={
                editing ? dateInputValue(editing.shownOn || editing.createdAt) : vancouverToday()
              }
              className="field"
            />
          </label>
        </div>
        <Banner status={status} />
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {busy ? "Saving..." : editing ? "Save screenshot" : "Save screenshot"}
          </Button>
          {editing ? (
            <Button
              type="button"
              variant="dark"
              onClick={() => {
                setEditing(null);
                setPreview("");
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
      {shots.length === 0 ? (
        <p className="mt-4 text-sm text-[#73756f]">No screenshot feedback yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {shots.map((shot) => (
            <li key={shot.id} className="flex gap-3 rounded-2xl border border-[#e0e1db] p-3">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#e4e5df]">
                {shot.screenshot ? (
                  <Image src={shot.screenshot} alt="" fill sizes="80px" className="object-cover" />
                ) : (
                  <ImagePlus className="m-auto size-5 text-[#9a9c95]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{shot.name || "No name"}</p>
                <p className="mt-1 text-xs text-[#9a9c95]">
                  {formatDisplayDate(shot.shownOn || shot.createdAt)}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label={`Edit screenshot from ${shot.name || "customer"}`}
                  onClick={() => {
                    setEditing(shot);
                    setPreview(shot.screenshot ?? "");
                  }}
                  className="h-fit rounded-full p-2 text-[#9a9c95] hover:bg-[#f3f3ef] hover:text-[#11120f]"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete screenshot from ${shot.name || "customer"}`}
                  disabled={pending === shot.id}
                  onClick={() => remove(shot.id)}
                  className="h-fit rounded-full p-2 text-[#9a9c95] hover:bg-red-50 hover:text-red-600"
                >
                  {pending === shot.id ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
