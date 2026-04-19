import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initSortingDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(2, 3, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create 5 Gaussian Splats (2D Circles) sorted by depth
    // They overlap each other to demonstrate alpha blending
    const splatsData = [
        { color: 0xbf616a, position: new THREE.Vector3(-1.0, 0.5, -2.0), scale: 1.5 }, // Furthest (Nord11 Red)
        { color: 0xd08770, position: new THREE.Vector3(0.8, -0.2, -1.0), scale: 1.2 }, // Nord12 Orange
        { color: 0xebcb8b, position: new THREE.Vector3(-0.5, -0.6, 0.0), scale: 1.8 }, // Nord13 Yellow
        { color: 0xa3be8c, position: new THREE.Vector3(1.2, 0.8, 1.0), scale: 1.3 }, // Nord14 Green
        { color: 0xb48ead, position: new THREE.Vector3(0.0, 0.2, 2.0), scale: 1.1 }  // Closest (Nord15 Purple)
    ];

    const splatMeshes = [];
    const geometry = new THREE.CircleGeometry(1, 32);

    splatsData.forEach((data, index) => {
        const material = new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            depthWrite: false // Crucial for alpha blending sequentially without Z-fighting artifacts
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(data.position);
        mesh.scale.set(data.scale, data.scale, 1);
        
        // Ensure they always face the camera like real splats (billboarding)
        // Normally done in vertex shader in 3DGS, but we'll do it in animate loop
        
        scene.add(mesh);
        splatMeshes.push(mesh);
    });

    // Add a perspective grid for context
    const grid = new THREE.GridHelper(10, 10, 0x4c566a, 0x3b4252);
    grid.position.y = -2;
    scene.add(grid);

    // Connecting Lines (to show ray from camera through splats)
    const rayMaterial = new THREE.LineBasicMaterial({ color: 0xd8dee9, transparent: true, opacity: 0.3 });
    const rayGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0,0,10), 
        new THREE.Vector3(0,0,-5)
    ]);
    const insightRay = new THREE.Line(rayGeometry, rayMaterial);
    scene.add(insightRay);

    // UI Controls
    const stepSlider = document.getElementById('render-step');
    const stepLabel = document.getElementById('step-label');

    function updateVisibility() {
        const currentStep = parseInt(stepSlider.value);
        
        splatMeshes.forEach((mesh, index) => {
            // Because they are ordered back-to-front in the array:
            // step 0 = none
            // step 1 = index 0 (Furthest)
            // step 5 = all (up to index 4)
            mesh.visible = index < currentStep;
        });

        if (currentStep === 0) {
            stepLabel.innerText = "Empty Buffer (Step 0)";
        } else if (currentStep < splatMeshes.length) {
            stepLabel.innerText = `Blending splat ${currentStep}...`;
        } else {
            stepLabel.innerText = "Final Image (All Blended)";
        }
    }

    stepSlider?.addEventListener('input', updateVisibility);
    updateVisibility();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        // Billboarding: make all splats face the camera continuously
        splatMeshes.forEach(mesh => {
            mesh.quaternion.copy(camera.quaternion);
        });

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
