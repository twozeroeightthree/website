// Lighthouse CI: budgets from the modernisation plan (phase 2). With BASE_URL
// it audits the deployed site; without it, the build in dist/.
const base = process.env.BASE_URL?.replace(/\/$/, "");
const urls = ["/", "/tops/", "/posidonias/", "/a-piece-of-chalk/"];

module.exports = {
  ci: {
    collect: {
      ...(base ? { url: urls.map((u) => base + u) } : { staticDistDir: "dist", url: urls.map((u) => `http://localhost${u}`) }),
      numberOfRuns: 3,
      settings: { chromeFlags: "--no-sandbox --headless=new" },
    },
    assert: {
      assertMatrix: [
        {
          // default mobile profile: simulated 4G
          matchingUrlPattern: ".*",
          assertions: {
            "largest-contentful-paint": ["error", { maxNumericValue: 2000, aggregationMethod: "median" }],
            "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
            "resource-summary:script:size": ["error", { maxNumericValue: 10 * 1024 }],
            // not the accessibility score: it counts the light greys kept on
            // purpose; tests/a11y.spec.ts runs axe with those exceptions
            "categories:best-practices": ["warn", { minScore: 0.95 }],
          },
        },
        {
          matchingUrlPattern: "^https?://[^/]+/$",
          assertions: { "resource-summary:total:size": ["error", { maxNumericValue: 500 * 1024 }] },
        },
        {
          matchingUrlPattern: "^https?://[^/]+/.+",
          assertions: { "resource-summary:total:size": ["error", { maxNumericValue: 800 * 1024 }] },
        },
      ],
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
};
