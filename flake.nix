{
  inputs = {
    utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:nixos/nixpkgs";
    jekyll-flake = { url = "github:haztecaso/flakes?dir=jekyll-flake"; inputs.nixpkgs.follows = "nixpkgs"; };
  };

  outputs = { self, nixpkgs, utils, jekyll-flake, ... }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; }; 
        jekyllPackages = jekyll-flake.packages.${system};
        jekyllApps = jekyll-flake.apps.${system};
      in rec {
        packages.twozeroeightthree = jekyllPackages.mkWeb {
          pname = "twozeroeightthree";
          version = "1.1";
          src = ./.;
        };
        defaultPackage = packages.twozeroeightthree;
      
        apps.serve = jekyllApps.serve;
        apps.serve-prod = jekyllApps.serve-prod;
        defaultApp = apps.serve;
      
        devShell = pkgs.mkShell {
          packages = [ jekyllPackages.jekyllFull ];
          inputsFrom = [ jekyllPackages.jekyllFull ];
          shellHook = ''
            alias serve="jekyll serve --watch --incremental --livereload"
            alias serve-prod="JEKYLL_ENV=production jekyll serve --watch --incremental --livereload"
          '';
        };
      });
}
