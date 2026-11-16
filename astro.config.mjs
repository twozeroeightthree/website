// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

// "prod" is set by the flake for the production package; anything else
// (next, previews, local dev) is marked noindex and has no canonical URL.
const isProd = process.env.SITE_ENV === "prod";

export default defineConfig({
  site: "https://twozeroeightthree.com",
  // Static files only: no adapter, no server at runtime.
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  redirects: {
    // left behind by jekyll-paginate
    "/page2/": "/",
  },
  integrations: isProd ? [sitemap()] : [],
  devToolbar: { enabled: false },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "DIN",
      cssVariable: "--font-din",
      fallbacks: ["Arial", "sans-serif"],
      options: {
        variants: [
          { src: ["./src/assets/fonts/DIN-Medium.woff2"], weight: 500, style: "normal" },
          { src: ["./src/assets/fonts/DIN-Light.woff2"], weight: 300, style: "normal" },
        ],
      },
    },
  ],
});
