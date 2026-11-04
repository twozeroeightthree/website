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
      jekyllEnv =
        pkgs:
        pkgs.bundlerEnv {
          name = "twozeroeightthree-jekyll";
          ruby = pkgs.ruby;
          gemdir = ./.;
        };
    in
    {
      packages = forAll (pkgs: rec {
        jekyll = jekyllEnv pkgs;
        twozeroeightthree = pkgs.stdenv.mkDerivation {
          pname = "twozeroeightthree.com";
          version = self.shortRev or self.dirtyShortRev or "dev";
          src = ./.;
          nativeBuildInputs = [ jekyll ];
          buildPhase = ''
            runHook preBuild
            export LC_ALL=C.UTF-8
            JEKYLL_ENV=production jekyll build
            runHook postBuild
          '';
          installPhase = ''
            runHook preInstall
            cp -r _site $out
            runHook postInstall
          '';
        };
        default = twozeroeightthree;
      });

      apps = forAll (pkgs: {
        serve = mkScript pkgs "serve" ''
          exec ${
            self.packages.${pkgs.stdenv.hostPlatform.system}.jekyll
          }/bin/jekyll serve --watch --incremental --livereload
        '';
        serve-prod = mkScript pkgs "serve-prod" ''
          JEKYLL_ENV=production exec ${
            self.packages.${pkgs.stdenv.hostPlatform.system}.jekyll
          }/bin/jekyll serve --watch --incremental --livereload
        '';
        # regenerate Gemfile.lock and gemset.nix after editing Gemfile
        lock = mkScript pkgs "lock" ''
          ${pkgs.bundler}/bin/bundle lock --update
          ${pkgs.bundix}/bin/bundix
        '';
      });

      devShells = forAll (pkgs: {
        default = pkgs.mkShell {
          packages = [
            self.packages.${pkgs.stdenv.hostPlatform.system}.jekyll
            pkgs.bundler
            pkgs.bundix
          ];
          shellHook = ''
            alias serve="jekyll serve --watch --livereload"
            alias serve-prod="JEKYLL_ENV=production jekyll serve --watch --livereload"
          '';
        };
      });

      formatter = forAll (pkgs: pkgs.nixfmt);
    };
}
