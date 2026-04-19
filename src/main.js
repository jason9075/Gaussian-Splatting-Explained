import katex from 'katex';
import { initGaussianKernelDemo } from './demos/GaussianKernel.js';
import { initProjectionDemo } from './demos/ProjectionDemo.js';
import { initSortingDemo } from './demos/SortingDemo.js';

// Initialize Math Rendering
const mathElements = {
    'math-pdf': 'G(x) = e^{-\\frac{1}{2}(x-\\mu)^T \\Sigma^{-1} (x-\\mu)}',
    'math-covariance': '\\Sigma = RSS^TR^T',
    'math-projection': '\\Sigma\' = J W \\Sigma W^T J^T',
    'math-alpha': 'C = \\sum_{i \\in N} c_i \\alpha_i \\prod_{j=1}^{i-1} (1 - \\alpha_j)'
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
    initGaussianKernelDemo('kernel-demo');
    initProjectionDemo('projection-demo');
    initSortingDemo('sorting-demo');
});
