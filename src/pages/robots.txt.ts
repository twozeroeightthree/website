import type { APIRoute } from "astro";
import { SITE } from "../lib/site";

export const GET: APIRoute = ({ site }) =>
  new Response(
    SITE.isProd
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap-index.xml", site)}\n`
      : "User-agent: *\nDisallow: /\n",
  );
