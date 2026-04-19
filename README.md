# 3D Gaussian Splatting Explained

![UI Preview](https://img.shields.io/badge/UI-Nord_Theme-88c0d0?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Tech-Vanilla_JS_%7C_Three.js_%7C_KaTeX-4c566a?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-a3be8c?style=flat-square)

An interactive, visual, and highly accessible tutorial designed to explain the core concepts of **3D Gaussian Splatting (3DGS)** from the ground up. This project breaks down complex mathematical papers into intuitive, hands-on 3D demonstrations directly in your browser.

👉 **[Live Demo](https://jason9075.github.io/Gaussian-Splatting-Explained/)**

🌐 **Dual Language Support**: Available in both English and Traditional Chinese (繁體中文).

## ✨ Features

Instead of static images and equations, this tutorial uses real-time **Three.js** widgets to visualize every step of the 3DGS pipeline:

1. **Initialization (SfM)**: Visualize how sparse point clouds are triangulated from multiple cameras (COLMAP).
2. **The Anatomy of a Gaussian**: Interact with sliders to manipulate the Scale ($\Sigma$) and Rotation ($R$) of a 3D kernel.
3. **Spherical Harmonics (SH)**: Orbit around a custom shader object to see how 3DGS handles view-dependent highlights and reflections.
4. **Splat Projection**: Watch a 3D ellipsoid flatten into a 2D splat onto the image plane.
5. **Tile-Based Rasterization**: A depth-sorting demo that breaks down the Alpha Blending (Radiance Field) equation step by step.
6. **The Optimization Loop**: Pure CSS diagrams explaining Adaptive Density Control (Clone vs. Split).

## 🚀 Getting Started

This project is built with a **zero-dependency** front-end architecture. No bundlers (like Vite or Webpack) are required. Everything uses native ES Modules (`<script type="importmap">`).

### Using Node.js
If you have Node.js installed, simply run the built-in server:
```bash
node server.js
```

### Using Nix & Just
If you are using Nix, this project comes with a Flake and a Justfile for a reproducible environment.
```bash
nix develop
just dev
```

Navigate to `http://localhost:8080` in your browser.

## 🛠 Tech Stack

* **Structure**: Semantic HTML5
* **Styling**: Vanilla CSS featuring the premium [Nord Color Palette](https://www.nordtheme.com/)
* **3D Visualizations**: [Three.js](https://threejs.org/) (Loaded via CDN)
* **Math Rendering**: [KaTeX](https://katex.org/) (Loaded via CDN)
* **Server**: Custom native Node.js HTTP server for zero-overhead local development.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/jason9075/Gaussian-Splatting-Explained/issues).

## 📝 License
This project is [MIT](LICENSE) licensed.
