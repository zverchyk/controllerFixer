import { createClient, type SanityClient } from "@sanity/client";
import { dateStamp } from "@/lib/dates";
import {
  joystickTypes,
  type JoystickKey,
} from "@/lib/joysticks";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = "2024-10-01";

export const sanityConfigured = Boolean(projectId);

// Reads use the public dataset. Writes need a token with Editor rights, and
// that token never leaves the server.
export const sanityWritable = Boolean(projectId && process.env.SANITY_API_TOKEN);

const categories = new Set(joystickTypes.map((type) => type.key));

export function isJoystickKey(value: unknown): value is JoystickKey {
  return typeof value === "string" && categories.has(value as JoystickKey);
}

function client(
  withToken: boolean,
  perspective?: "published" | "raw",
): SanityClient {
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective,
    token: withToken ? process.env.SANITY_API_TOKEN : undefined,
  });
}

export function writeClient() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN is not set");
  }
  return client(true);
}

// Draft documents are hidden from the public dataset. Feedback invites live
// there so customer names and private links are not publicly queryable.
export function draftClient() {
  return client(true, "raw");
}

export type StoredFeedback = {
  id: string;
  quote: string;
  name: string;
  repair?: string;
  rating?: number;
  format?: "text" | "screenshot";
  shownOn?: string;
  screenshot?: string;
  images: string[];
  createdAt: string;
};

export type StoredVideo = {
  id: string;
  url: string;
  title?: string;
  category: JoystickKey;
  createdAt: string;
};

export type StoredGalleryImage = {
  id: string;
  url: string;
  createdAt: string;
  takenOn?: string;
};

export type SiteContent = {
  feedback: StoredFeedback[];
  videos: StoredVideo[];
  gallery: StoredGalleryImage[];
};

const EMPTY: SiteContent = { feedback: [], videos: [], gallery: [] };

function sized(url: string | null | undefined, width: number) {
  if (!url) return null;
  return `${url}?w=${width}&auto=format`;
}

export async function fetchSiteContent(): Promise<SiteContent> {
  if (!sanityConfigured) return EMPTY;

  const data = await client(false).fetch<{
    feedback: Array<
      Omit<StoredFeedback, "images" | "rating" | "screenshot"> & {
        images: (string | null)[];
        rating?: number | null;
        screenshot?: string | null;
      }
    >;
    videos: StoredVideo[];
    gallery: Array<{ id: string; url: string | null; createdAt: string; takenOn?: string | null }>;
  }>(
    `{
      "feedback": *[_type == "testimonial" && (!defined(status) || status == "approved")] | order(_createdAt desc) {
        "id": _id,
        quote,
        name,
        repair,
        rating,
        format,
        shownOn,
        "screenshot": screenshot.asset->url,
        "createdAt": _createdAt,
        "images": images[].asset->url
      },
      "videos": *[_type == "joystickVideo" && defined(url)] | order(_createdAt desc) {
        "id": _id,
        url,
        title,
        category,
        "createdAt": _createdAt
      },
      "gallery": *[_type == "galleryImage" && defined(image)] {
        "id": _id,
        "url": image.asset->url,
        takenOn,
        "createdAt": _createdAt
      }
    }`,
    {},
    { cache: "no-store" },
  );

  return {
    feedback: (data?.feedback ?? [])
      .filter((row) =>
        row.format === "screenshot" ? Boolean(row.screenshot) : Boolean(row.quote && row.name),
      )
      .map((row) => ({
        ...row,
        quote: row.quote ?? "",
        name: row.name ?? "",
        format: row.format === "screenshot" ? ("screenshot" as const) : ("text" as const),
        repair: row.repair || undefined,
        shownOn: row.shownOn || undefined,
        screenshot: sized(row.screenshot, 1600) ?? undefined,
        rating:
          typeof row.rating === "number" && row.rating >= 1 && row.rating <= 5
            ? Math.round(row.rating)
            : undefined,
        images: (row.images ?? [])
          .map((url) => sized(url, 1200))
          .filter((url): url is string => Boolean(url)),
      })),
    videos: (data?.videos ?? []).filter(
      (row) => row.url && isJoystickKey(row.category),
    ),
    gallery: (data?.gallery ?? [])
      .map((row) => ({
        ...row,
        url: sized(row.url, 1600) ?? "",
        takenOn: row.takenOn || undefined,
      }))
      .filter((row) => row.url.length > 0)
      .sort(
        (a, b) =>
          dateStamp(b.takenOn || b.createdAt) - dateStamp(a.takenOn || a.createdAt),
      ),
  };
}
