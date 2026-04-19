import katex from 'katex';
import { initGaussianKernelDemo } from './demos/GaussianKernel.js';
import { initProjectionDemo } from './demos/ProjectionDemo.js';
import { initSortingDemo } from './demos/SortingDemo.js';
import { initColmapDemo } from './demos/ColmapDemo.js';
import { initSHDemo } from './demos/SphericalHarmonicsDemo.js';
import { initMeshExtractionDemo } from './demos/MeshExtractionDemo.js';

// Initialize Math Rendering
const mathElements = {
    'math-pdf': 'G(x) = e^{-\\frac{1}{2}(x-\\mu)^T \\Sigma^{-1} (x-\\mu)}',
    'math-influence': 'Intensity(x) = \\alpha \\cdot e^{-\\frac{1}{2}(x-\\mu)^T \\Sigma^{-1} (x-\\mu)}',
    'math-covariance': '\\Sigma = RSS^TR^T',
    'math-sh': 'c(\\theta, \\phi) = \\sum_{l=0}^{k} \\sum_{m=-l}^{l} y_{lm} Y_{lm}(\\theta, \\phi)',
    'math-projection': '\\Sigma\' = J W \\Sigma W^T J^T',
    'math-alpha': 'C = \\sum_{i \\in N} c_i \\alpha_i T_i \\quad , \\quad T_i = \\prod_{j=1}^{i-1} (1 - \\alpha_j)',
    'math-loss': '\\mathcal{L} = (1 - \\lambda)\\mathcal{L}_1(I_{render}, I_{gt}) + \\lambda \\mathcal{L}_{D-SSIM}(I_{render}, I_{gt})'
};

document.addEventListener('DOMContentLoaded', () => {
    Object.entries(mathElements).forEach(([id, tex]) => {
        const element = document.getElementById(id);
        if (element) {
            katex.render(tex, element, {
                throwOnError: false,
                displayMode: true
            });
        }
    });

    // Initialize Demos
    initColmapDemo('colmap-demo');
    initGaussianKernelDemo('kernel-demo');
    initProjectionDemo('projection-demo');
    initSortingDemo('sorting-demo');
    initSHDemo('sh-demo');
    initMeshExtractionDemo('mesh-demo');

    // Sidebar Toggle Logic
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const layoutWrapper = document.getElementById('layout-wrapper');

    toggleBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('visible');
        layoutWrapper.classList.toggle('sidebar-open');
        
        // Change button text contextually
        if (sidebar.classList.contains('visible')) {
            toggleBtn.innerHTML = '✕';
        } else {
            toggleBtn.innerHTML = '☰';
        }
    });

    // Close sidebar when a navigation link is clicked (mobile friendly)
    const navLinks = document.querySelectorAll('.sidebar nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('visible');
                layoutWrapper.classList.remove('sidebar-open');
                toggleBtn.innerHTML = '☰';
            }
        });
    });
});
