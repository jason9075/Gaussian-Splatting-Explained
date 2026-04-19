# 3D Gaussian Splatting Tutorial Justfile

# Default command
default:
    @just --list

# Development mode with file watching
dev:
    @echo "Watching for file changes..."
    find . -maxdepth 2 -not -path '*/.*' -not -path './node_modules*' | entr -r echo "Something changed! Run 'just build' or custom update logic here."

# Placeholder for setup
setup:
    npm install

# Placeholder for build
build:
    @echo "Building the project..."
    # npm run build
