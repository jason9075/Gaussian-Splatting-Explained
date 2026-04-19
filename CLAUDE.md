# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive, browser-based educational tutorial on **3D Gaussian Splatting (3DGS)** — a novel view synthesis technique. Features 6 Three.js interactive demos, KaTeX math rendering, and dual-language support (English + Traditional Chinese).

## Commands

```bash
# Enter dev environment (NixOS)
nix develop

# Install dependencies
just setup        # npm install

# Start dev server at http://localhost:8080
just dev          # npm run dev / node server.js
```

No build step — native ES modules served directly.

## Architecture

### No Bundler

Libraries (Three.js, KaTeX) are loaded via **importmap** in `index.html`/`index_zh.html`. Do not introduce a bundler or build pipeline.

### Module Structure

- `server.js` — Vanilla Node.js HTTP server (port 8080), static file serving with MIME types
- `src/main.js` — Entry point: dynamically imports demo modules, triggers KaTeX rendering
- `src/style.css` — Nord color palette theme, responsive layout
- `src/demos/*.js` — Each demo is a self-contained ES module exporting a `setup(container)` function that initializes a Three.js scene

### Dual-Language Pages

`index.html` (English) and `index_zh.html` (Traditional Chinese) are maintained in parallel. Changes to demo integration or structure must be reflected in both files.

### Demo Pattern

Each demo in `src/demos/` follows this convention:
```js
export function setup(container) {
  // Three.js scene setup, animation loop, cleanup
}
```

Demos are registered in `src/main.js` and matched to `<div>` containers in the HTML by ID.

## Content Guidelines

The `guildlines` file (note: intentional filename) documents the mathematical content scope — Gaussian kernels, covariance decomposition, projection, tile-based rasterization, alpha blending, adaptive density control, and mesh extraction (marching cubes).
