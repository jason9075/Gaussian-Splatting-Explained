import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initColmapDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(6, 4, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 1. Central Target Object (TorusKnot)
    const objectGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    // Use an interesting wireframe/solid combo to look like a scanned object
    const objectMaterialSolid = new THREE.MeshBasicMaterial({ 
        color: 0x4c566a, // Nord3
        transparent: true,
        opacity: 0.8
    });
    const objectMaterialWire = new THREE.MeshBasicMaterial({
        color: 0x88c0d0, // Nord8
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    const targetGroup = new THREE.Group();
    targetGroup.add(new THREE.Mesh(objectGeometry, objectMaterialSolid));
    targetGroup.add(new THREE.Mesh(objectGeometry, objectMaterialWire));
    scene.add(targetGroup);

    // 2. Camera Frustums (Simulating COLMAP capturing images)
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    
    const frustumMaterial = new THREE.LineBasicMaterial({ color: 0xbf616a }); // Nord11 Red
    const rayMaterial = new THREE.LineDashedMaterial({ 
        color: 0xebcb8b, // Nord13
        dashSize: 0.2, 
        gapSize: 0.2,
        transparent: true,
        opacity: 0.5
    });

    const numCameras = 12;
    const radius = 5;

    for (let i = 0; i < numCameras; i++) {
        const theta = (i / numCameras) * Math.PI * 2;
        // Introduce some height variance
        const height = Math.sin(theta * 3) * 1.5; 
        
        const camPos = new THREE.Vector3(
            Math.cos(theta) * radius,
            height,
            Math.sin(theta) * radius
        );

        // Build a simple pyramid to represent the camera frustum
        const frustumGeom = new THREE.BufferGeometry();
        // Base of the pyramid (viewport)
        const w = 0.4, h = 0.3, d = 0.5;
        const pts = [
            0,0,0, -w,h,d,
            0,0,0,  w,h,d,
            0,0,0,  w,-h,d,
            0,0,0, -w,-h,d,
            -w,h,d, w,h,d,
             w,h,d, w,-h,d,
             w,-h,d, -w,-h,d,
            -w,-h,d, -w,h,d
        ];
        
        const vertices = new Float32Array(pts);
        frustumGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const cameraMesh = new THREE.LineSegments(frustumGeom, frustumMaterial);
        cameraMesh.position.copy(camPos);
        cameraMesh.lookAt(targetGroup.position);
        
        cameraGroup.add(cameraMesh);

        // Add a line representing triangulation ray targeting the center (or random surface points)
        const targetPt = new THREE.Vector3(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5
        );
        const lineGeom = new THREE.BufferGeometry().setFromPoints([camPos, targetPt]);
        const line = new THREE.Line(lineGeom, rayMaterial);
        line.computeLineDistances(); // required for dashed line
        scene.add(line);
    }

    // Grid
    const grid = new THREE.GridHelper(15, 15, 0x434c5e, 0x3b4252);
    grid.position.y = -3;
    scene.add(grid);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        // Slowly rotate the target object to make it dynamic
        targetGroup.rotation.y += 0.005;
        targetGroup.rotation.x += 0.002;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
