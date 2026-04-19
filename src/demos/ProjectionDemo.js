import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initProjectionDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    
    // We use a fixed camera to view the entire projection setup from the side
    const aspect = container.clientWidth / container.clientHeight;
    // Orthographic camera for diagrammatic view or Perspective for dynamic
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    camera.position.set(5, 4, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 1. 3D Gaussian (Ellipsoid)
    const ellipsoidGeometry = new THREE.SphereGeometry(1, 32, 32);
    const ellipsoidMaterial = new THREE.MeshNormalMaterial({ 
        transparent: true, 
        opacity: 0.8,
        wireframe: false 
    });
    const ellipsoid = new THREE.Mesh(ellipsoidGeometry, ellipsoidMaterial);
    ellipsoid.position.set(0, 2, -2);
    ellipsoid.scale.set(1.5, 0.8, 1.2);
    ellipsoid.rotation.set(0.5, 0.2, 0);
    scene.add(ellipsoid);

    // 2. The Imaging Plane (Screen)
    const planeGeometry = new THREE.PlaneGeometry(6, 4);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x81a1c1, // Nord9
        transparent: true, 
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const imagingPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    // Position the plane forward to act as the "screen"
    imagingPlane.position.set(0, 0, 2);
    scene.add(imagingPlane);

    // Plane Grid Helper to look like a screen pixel grid
    const planeGrid = new THREE.GridHelper(6, 12, 0xd8dee9, 0x4c566a);
    planeGrid.rotation.x = Math.PI / 2;
    imagingPlane.add(planeGrid);

    // 3. The 2D Splat (Projection on the plane)
    // We simulate the projection by creating a flat disc on the imaging plane
    const splatGeometry = new THREE.CircleGeometry(1, 32);
    const splatMaterial = new THREE.MeshBasicMaterial({
        color: 0xbf616a, // Nord11 (Red accent)
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const splat = new THREE.Mesh(splatGeometry, splatMaterial);
    // Put it slightly in front of the imaging plane to avoid z-fighting
    splat.position.set(0, 0, 0.01);
    imagingPlane.add(splat);

    // 4. Projection Rays (Lines connecting 3D to 2D)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xebcb8b, transparent: true, opacity: 0.5 }); // Nord13
    const rays = new THREE.Group();
    scene.add(rays);

    function updateProjection() {
        // Clear old rays
        while(rays.children.length > 0) { 
            rays.remove(rays.children[0]); 
        }

        // Animate the 3D ellipsoid's rotation
        ellipsoid.rotation.x += 0.01;
        ellipsoid.rotation.y += 0.015;

        // Naive mock of projection math: 
        // We use the rotation to deform the 2D splat shape on the plane dynamically
        const rotY = Math.abs(Math.sin(ellipsoid.rotation.y));
        const rotX = Math.abs(Math.cos(ellipsoid.rotation.x));
        
        splat.scale.set(
            1.5 + rotY * 0.5, 
            0.8 + rotX * 0.5, 
            1
        );
        
        // Slightly offset the splat center reflecting the projection (mock)
        splat.position.x = ellipsoid.position.x * 0.5;
        splat.position.y = (ellipsoid.position.y - 2) * 0.5;

        // Draw 4 corner rays from ellipsoid bounding box to splat
        const points = [
            new THREE.Vector3().setFromMatrixPosition(ellipsoid.matrixWorld).add(new THREE.Vector3(1, 1, 0)),
            new THREE.Vector3().setFromMatrixPosition(ellipsoid.matrixWorld).add(new THREE.Vector3(-1, 1, 0)),
            new THREE.Vector3().setFromMatrixPosition(ellipsoid.matrixWorld).add(new THREE.Vector3(-1, -1, 0)),
            new THREE.Vector3().setFromMatrixPosition(ellipsoid.matrixWorld).add(new THREE.Vector3(1, -1, 0))
        ];

        const splatPoints = [
            new THREE.Vector3().setFromMatrixPosition(splat.matrixWorld).add(new THREE.Vector3(splat.scale.x, splat.scale.y, 0)),
            new THREE.Vector3().setFromMatrixPosition(splat.matrixWorld).add(new THREE.Vector3(-splat.scale.x, splat.scale.y, 0)),
            new THREE.Vector3().setFromMatrixPosition(splat.matrixWorld).add(new THREE.Vector3(-splat.scale.x, -splat.scale.y, 0)),
            new THREE.Vector3().setFromMatrixPosition(splat.matrixWorld).add(new THREE.Vector3(splat.scale.x, -splat.scale.y, 0))
        ];

        for (let i = 0; i < 4; i++) {
            const geom = new THREE.BufferGeometry().setFromPoints([points[i], splatPoints[i]]);
            const line = new THREE.Line(geom, lineMaterial);
            rays.add(line);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        
        controls.update();
        updateProjection();

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
