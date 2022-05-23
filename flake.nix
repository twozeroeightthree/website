{
  inputs = {
    utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:nixos/nixpkgs";
    jekyll-flake = { url = "github:haztecaso/flakes?dir=jekyll-flake"; inputs.nixpkgs.follows = "nixpkgs"; };
  };

  outputs = { self, nixpkgs, utils, jekyll-flake }: {
    overlay = final: prev: {
      web = final.callPackage ({ stdenv, jekyllFull, ruby, nodejs }: stdenv.mkDerivation {
        name = "web";
        src = ./.;
        buildInputs = [ jekyllFull ruby nodejs ];
        buildPhase = ''
	      JEKYLL_ENV=production jekyll build
        '';
        installPhase = ''
          mkdir -p $out
          cp -Tr _site $out/www/
        '';
      }) {};
    };

  } // utils.lib.eachDefaultSystem (system:
  let
    pkgs = import nixpkgs { inherit system; overlays = [jekyll-flake.overlay self.overlay]; }; 
    mkAppScript = name: script: {
      type = "app";
      program = "${pkgs.writeShellScriptBin name script}/bin/${name}";
    };
  in rec {
    packages.web = pkgs.web;
    defaultPackage = packages.web;

    apps.serve = mkAppScript "serve" ''
      export PATH="${pkgs.nodejs}/bin:$PATH"
      ${pkgs.jekyllFull}/bin/bundle exec jekyll serve --watch --incremental --livereload
    '';

    apps.serve-prod = mkAppScript "serve-prod" ''
      export PATH="${pkgs.nodejs}/bin:$PATH"
      JEKYLL_ENV=production ${pkgs.jekyllFull}/bin/jekyll serve --watch --incremental --livereload
    '';

    defaultApp = apps.serve;

    devShell = pkgs.mkShell {
      nativeBuildInputs = with pkgs; [ jekyllFull ruby nodejs ];
    };
  });
}
