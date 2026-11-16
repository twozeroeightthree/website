{
  description = "twozeroeightthree.com";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      forAll = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
      mkScript = pkgs: name: text: {
        type = "app";
        program = "${pkgs.writeShellScript name text}";
      };
      # prod: indexable, canonical URLs and sitemap. preview: noindex (next and branch previews)
      mkSite =
        pkgs: siteEnv:
        pkgs.buildNpmPackage {
          pname = "twozeroeightthree.com-${siteEnv}";
          version = self.shortRev or self.dirtyShortRev or "dev";
          src = pkgs.lib.fileset.toSource {
            root = ./.;
            fileset = pkgs.lib.fileset.unions [
              ./package.json
              ./package-lock.json
              ./astro.config.mjs
              ./tsconfig.json
              ./public
              ./src
            ];
          };
          nodejs = pkgs.nodejs_24;
          # reads package-lock.json directly: no npmDepsHash to keep in sync
          npmDeps = pkgs.importNpmLock { npmRoot = ./.; };
          npmConfigHook = pkgs.importNpmLock.npmConfigHook;
          env = {
            SITE_ENV = siteEnv;
            ASTRO_TELEMETRY_DISABLED = "1";
          };
          installPhase = ''
            runHook preInstall
            cp -r dist $out
            runHook postInstall
          '';
        };
    in
    {
      packages = forAll (pkgs: rec {
        prod = mkSite pkgs "prod";
        preview = mkSite pkgs "preview";
        default = preview;
      });

      apps = forAll (pkgs: {
        serve = mkScript pkgs "serve" ''
          export PATH=${pkgs.nodejs_24}/bin:$PATH
          [ -d node_modules ] || npm ci
          exec npm run dev
        '';
        serve-prod = mkScript pkgs "serve-prod" ''
          export PATH=${pkgs.nodejs_24}/bin:$PATH
          [ -d node_modules ] || npm ci
          SITE_ENV=prod npm run build && exec npm run preview
        '';
      });

      devShells = forAll (
        pkgs:
        let
          # must match the @playwright/test version in package.json
          browsers = pkgs.playwright-driver.browsers.override {
            withFirefox = false;
            withWebkit = false;
          };
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs_24
              pkgs.lychee
            ];
            ASTRO_TELEMETRY_DISABLED = "1";
            PLAYWRIGHT_BROWSERS_PATH = browsers;
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "1";
            # same fonts locally and in CI, so the screenshots match
            FONTCONFIG_FILE = pkgs.makeFontsConf { fontDirectories = [ pkgs.dejavu_fonts ]; };
            # Lighthouse reuses Playwright's Chromium
            shellHook = ''
              export CHROME_PATH=$(echo $PLAYWRIGHT_BROWSERS_PATH/chromium-*/chrome-*/chrome)
            '';
          };
        }
      );

      formatter = forAll (pkgs: pkgs.nixfmt);
    };
}
