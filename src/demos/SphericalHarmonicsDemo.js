import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initSHDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(4, 2, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 1. SH Shader Material
    // We simulate a simple view-dependent color using a basic reflection model
    // which mimics how higher-order SH coefficients work in 3DGS.
    const shShader = {
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vViewDir = normalize(cameraPosition - worldPosition.xyz);
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
                // Base Nord color (Deep Polar Blue)
                vec3 baseColor = vec3(0.18, 0.20, 0.25); // Nord0-ish
                
                // View-dependent "Highlight" (Simulating SH coefficients)
                // When you look from different angles, the 'dot' product changes.
                float viewFactor = dot(vNormal, vViewDir);
                
                // Simulate a specular highlight color (Nord8 Frost)
                vec3 shHighlight = vec3(0.53, 0.75, 0.82); 
                
                // Add a second "glitter" factor for more dramatic SH effect
                float glitter = pow(max(0.0, viewFactor), 8.0);
                
                // Final color is base + SH contribution
                vec3 finalColor = mix(baseColor, shHighlight, viewFactor * 0.5 + 0.2);
                finalColor += shHighlight * glitter * 0.8;
                
                gl_FragColor = vec4(finalColor, 0.95);
            }
        `
    };

    const shMaterial = new THREE.ShaderMaterial({
        vertexShader: shShader.vertexShader,
        fragmentShader: shShader.fragmentShader,
        transparent: true
    });

    // 2. Large Ellipsoid to show SH effect
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const ellipsoid = new THREE.Mesh(geometry, shMaterial);
    ellipsoid.scale.set(1.5, 0.8, 1.0); // Make it an ellipsoid
    scene.add(ellipsoid);

    // 3. Environment Context
    const grid = new THREE.GridHelper(10, 10, 0x4c566a, 0x3b4252);
    grid.position.y = -2;
    scene.add(grid);

    // Add some guiding labels or arrows to show view dependency
    // (Optional: simple coordinate axes)
    const axes = new THREE.AxesHelper(2);
    scene.add(axes);

    let animId = null;

    function animate() {
        animId = requestAnimationFrame(animate);
        controls.update();

        // Gentle rotation
        ellipsoid.rotation.y += 0.002;

        renderer.render(scene, camera);
    }

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
