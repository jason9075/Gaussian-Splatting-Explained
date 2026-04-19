{
  description = "3D Gaussian Splatting Tutorial Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            just
            entr
            nodejs_20
          ];

          shellHook = ''
            echo "🎨 3D Gaussian Splatting Dev Environment Loaded"
            echo "Available commands: just dev"
          '';
        };
      }
    );
}
