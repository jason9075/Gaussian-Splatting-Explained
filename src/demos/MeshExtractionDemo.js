import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initMeshExtractionDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(5, 4, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 1. Target Object (The Radiance Field)
    const targetGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
    const targetMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4c566a, // Nord3
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    scene.add(targetMesh);

    // 2. Voxel Slice Visualization
    const sliceCount = 20;
    const sliceSize = 5;
    const voxelGeometry = new THREE.PlaneGeometry(0.15, 0.15);
    const voxels = [];
    const sliceGroup = new THREE.Group();
    
    for (let i = 0; i < sliceCount; i++) {
        for (let j = 0; j < sliceCount; j++) {
            const mat = new THREE.MeshBasicMaterial({ color: 0x88c0d0, side: THREE.DoubleSide });
            const voxel = new THREE.Mesh(voxelGeometry, mat);
            voxel.position.set(
                (i / sliceCount - 0.5) * sliceSize,
                (j / sliceCount - 0.5) * sliceSize,
                0
            );
            sliceGroup.add(voxel);
            voxels.push(voxel);
        }
    }
    scene.add(sliceGroup);

    // 3. Virtual Cameras
    const camMaterial = new THREE.LineBasicMaterial({ color: 0xbf616a }); // Nord11 Red
    const frustumGeom = new THREE.BufferGeometry();
    const w = 0.3, h = 0.2, d = 0.4;
    const pts = [0,0,0, -w,h,d, 0,0,0, w,h,d, 0,0,0, w,-h,d, 0,0,0, -w,-h,d, -w,h,d, w,h,d, w,h,d, w,-h,d, w,-h,d, -w,-h,d, -w,-h,d, -w,h,d];
    frustumGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    
    const cameraGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const c = new THREE.LineSegments(frustumGeom, camMaterial);
        cameraGroup.add(c);
    }
    scene.add(cameraGroup);

    // Grid Utility
    const grid = new THREE.GridHelper(10, 10, 0x434c5e, 0x3b4252);
    grid.position.y = -3;
    scene.add(grid);

    // Distance calculation (simplified Signed Distance)
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector3();

    let animId = null;
    let startTime = null;

    function animate(timestamp) {
        animId = requestAnimationFrame(animate);
        if (startTime === null) startTime = timestamp;
        const time = (timestamp - startTime) * 0.001;

        // Animate Slice
        sliceGroup.position.z = Math.sin(time * 0.5) * 2;

        // Update Voxel colors based on distance to targetMesh
        const _worldPos = new THREE.Vector3();
        voxels.forEach(v => {
            v.getWorldPosition(_worldPos);

            // Check if inside or outside (Simulated SDF logic for demo)
            const dist = _worldPos.length();
            const threshold = 1.4 + Math.sin(_worldPos.x * 2) * 0.2;

            if (dist < threshold) {
                v.material.color.setHex(0xbf616a);       // Inside: Red (Negative SDF)
            } else if (dist < threshold + 0.15) {
                v.material.color.setHex(0xebcb8b);       // Surface: Gold (0-Level)
            } else {
                v.material.color.setHex(0x88c0d0);       // Outside: Blue (Positive SDF)
            }
        });

        // Orbit Virtual Cameras
        cameraGroup.children.forEach((c, idx) => {
            const angle = time * 0.3 + (idx * Math.PI / 2);
            c.position.set(Math.cos(angle) * 4, 1, Math.sin(angle) * 4);
            c.lookAt(0, 0, 0);
        });

        controls.update();
        renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    return {
        start() { if (animId === null) animate(performance.now()); },
        stop() { if (animId !== null) { cancelAnimationFrame(animId); animId = null; } }
    };
}
