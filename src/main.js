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

    // --- Sidebar Toggle ---
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const layoutWrapper = document.getElementById('layout-wrapper');

    // Restore sidebar state from previous session
    if (localStorage.getItem('sidebarOpen') === 'true') {
        sidebar.classList.add('visible');
        layoutWrapper.classList.add('sidebar-open');
        toggleBtn.innerHTML = '✕';
    }

    toggleBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('visible');
        layoutWrapper.classList.toggle('sidebar-open');
        const isOpen = sidebar.classList.contains('visible');
        localStorage.setItem('sidebarOpen', isOpen);
        toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close sidebar when a navigation link is clicked (mobile friendly)
    const navLinks = document.querySelectorAll('.sidebar nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('visible');
                layoutWrapper.classList.remove('sidebar-open');
                localStorage.setItem('sidebarOpen', false);
                toggleBtn.innerHTML = '☰';
            }
        });
    });

    // --- Scroll Spy: highlight current section in sidebar ---
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.sidebar nav a[href="#${entry.target.id}"]`);
                activeLink?.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => sectionObserver.observe(s));

    // --- Lazy Demo Initialization via IntersectionObserver ---
    const demoInits = {
        'colmap-demo':     initColmapDemo,
        'kernel-demo':     initGaussianKernelDemo,
        'projection-demo': initProjectionDemo,
        'sorting-demo':    initSortingDemo,
        'sh-demo':         initSHDemo,
        'mesh-demo':       initMeshExtractionDemo,
    };

    const demoHandles = {};

    const demoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            if (entry.isIntersecting) {
                if (!demoHandles[id]) {
                    demoHandles[id] = demoInits[id](id);
                }
                demoHandles[id]?.start();
            } else {
                demoHandles[id]?.stop();
            }
        });
    }, { threshold: 0.1 });

    Object.keys(demoInits).forEach(id => {
        const el = document.getElementById(id);
        if (el) demoObserver.observe(el);
    });
});
