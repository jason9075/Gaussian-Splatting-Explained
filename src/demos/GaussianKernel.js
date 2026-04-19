import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initGaussianKernelDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Grid Helper
    const grid = new THREE.GridHelper(10, 10, 0x333333, 0x222222);
    scene.add(grid);

    // Gaussian Ellipsoid (Visualization)
    // We represent the Gaussian as an ellipsoid mesh with custom shader or just a transformed sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshNormalMaterial({ 
        transparent: true, 
        opacity: 0.6,
        wireframe: false 
    });
    const ellipsoid = new THREE.Mesh(geometry, material);
    scene.add(ellipsoid);

    // Wireframe Overlay
    const wireframe = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 })
    );
    ellipsoid.add(wireframe);

    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0, 0);

    // Controls
    const scaleXInput = document.getElementById('scale-x');
    const scaleYInput = document.getElementById('scale-y');
    const rotationZInput = document.getElementById('rotation-z');

    function updateTransform() {
        const sx = parseFloat(scaleXInput.value);
        const sy = parseFloat(scaleYInput.value);
        const rz = parseFloat(rotationZInput.value);

        ellipsoid.scale.set(sx, sy, 1);
        ellipsoid.rotation.z = rz;
    }

    scaleXInput?.addEventListener('input', updateTransform);
    scaleYInput?.addEventListener('input', updateTransform);
    rotationZInput?.addEventListener('input', updateTransform);

    updateTransform();

    // Animation Loop
    let animId = null;

    function animate() {
        animId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    return {
        start() { if (animId === null) animate(); },
        stop() { if (animId !== null) { cancelAnimationFrame(animId); animId = null; } }
    };
}
