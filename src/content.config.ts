import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const works = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/works",
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ""),
  }),
  schema: ({ image }) => {
    const alt = z.string().trim().min(1, "every image needs alt text");
    const picture = z.object({ src: image(), alt });
    // Animated pieces: <name>.mp4 and <name>.webm next to index.md
    const video = z.object({ video: z.string(), poster: image(), alt });
    return z.object({
      title: z.string(),
      location: z.string().optional(),
      order: z.number().int().positive(),
      description: z.string(),
      year: z.number().int().optional(),
      materials: z.array(z.string()).optional(),
      dimensions: z.array(z.string()).optional(),
      infoOnRequest: z.boolean().default(false),
      cover: picture,
      gallery: z.array(z.union([picture, video])).min(1),
    });
  },
});

export const collections = { works };
