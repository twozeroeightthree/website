import { getCollection, type CollectionEntry } from "astro:content";

export const SITE = {
  title: "2083",
  author: "Brendan McCormick",
  email: "brendanemccormick@gmail.com",
  description:
    "A showcase for contemporary art pieces located somewhere between art and design. Informed by a simple impulse or thought and influenced by process and circumstance, the work attempts to present the qualities inherent in an object or material.",
  // Only the production build gets indexed and a canonical URL
  isProd: process.env.SITE_ENV === "prod",
};

export type Work = CollectionEntry<"works">;

/** Works sorted by `order`; fails the build if two share the same position. */
export async function getWorks(): Promise<Work[]> {
  const works = (await getCollection("works")).sort((a, b) => a.data.order - b.data.order);
  const seen = new Map<number, string>();
  for (const w of works) {
    const other = seen.get(w.data.order);
    if (other) throw new Error(`works "${other}" and "${w.id}" both have order ${w.data.order}`);
    seen.set(w.data.order, w.id);
  }
  return works;
}

export const workUrl = (work: Work) => `/${work.id}/`;

/** "Sheikh Zayed Road _ E11 — Tyre fragments" */
export const fullTitle = (work: Work) =>
  work.data.location ? `${work.data.location} — ${work.data.title}` : work.data.title;
