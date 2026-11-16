# 2083

Portfolio of Brendan McCormick, built with [Astro](https://astro.build) as a fully static site.

## Development

```sh
nix run .#serve        # astro dev on http://localhost:4321
nix run .#serve-prod   # production build, served locally
nix build              # noindex preview build in ./result
nix build .#prod       # production build (canonical URLs, sitemap, robots)
```

Without Nix: Node 24, then `npm ci` and `npm run dev`.

## Content

Each work is a folder in `src/content/works/<slug>/`: an `index.md` plus its images, at full resolution. The build generates every size and format. The schema in `src/content.config.ts` validates the front matter:

```yaml
title: Tyre fragments
location: Sheikh Zayed Road _ E11   # optional, shown above the title
order: 1                            # position on the home page and in the menu
description: One or two sentences, used for search engines and link previews.
year: 2017                          # optional
materials: [tyre fragments]         # optional
dimensions: ["50 × 50 × 5 cm"]      # optional
infoOnRequest: true                 # optional, adds an enquiry link
cover:
  src: ./cover.jpg
  alt: Description of the image
gallery:
  - src: ./tyre_01.jpg
    alt: Description of the image
  - video: ./chalk_04               # chalk_04.mp4 and chalk_04.webm in the same folder
    poster: ./chalk_04-poster.jpg
    alt: Description of the video
```

The body of `index.md` is the text of the work, in Markdown.

## Deploy

GitHub Actions builds with Nix and deploys with [muelle](https://github.com/haztecaso/muelle): `master` goes to *next*, `v*` tags to production, and every other branch to its own preview. Only tag builds use `.#prod`; the rest are `noindex`.
