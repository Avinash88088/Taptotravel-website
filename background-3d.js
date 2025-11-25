import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';

console.log('Global 3D Background initializing with Scrollytelling...');

// Performance Detection
const isMobile = window.innerWidth < 768;
const isLowEnd = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
console.log(`Device: ${isMobile ? 'Mobile' : 'Desktop'}, Low-end: ${isLowEnd}`);

const container = document.createElement('div');
container.id = 'global-3d-bg';
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100%';
container.style.height = '100%';
container.style.zIndex = '1';
container.style.pointerEvents = 'none'; // Allow clicks to pass through
document.body.prepend(container);

const scene = new THREE.Scene();
// Fog for depth (Removed to prevent "blue rectangle" artifact on transparent bg)
// scene.fog = new THREE.FogExp2(0x000000, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !isLowEnd, // Disable antialiasing on low-end devices
    powerPreference: isLowEnd ? 'low-power' : 'high-performance'
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(isLowEnd ? 1 : Math.min(window.devicePixelRatio, 2)); // Cap at 1 for low-end
container.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Very dim ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5); 
scene.add(directionalLight);

// Blue Rim Light (Cyberpunk feel)
const rimLight = new THREE.SpotLight(0x2997ff, 5); 
rimLight.position.set(-5, 5, -2); 
rimLight.lookAt(0, 0, 0);
scene.add(rimLight);

// --- Assets ---
const textureLoader = new THREE.TextureLoader();

// 1. Hero Globe (Holographic Dark Mode)
const globeGroup = new THREE.Group();
scene.add(globeGroup);

// Load Textures
const earthTexture = textureLoader.load('earth_texture.jpg');
const earthNormal = textureLoader.load('earth_normal.jpg');

// Earth Sphere
const geometry = new THREE.SphereGeometry(2.5, isLowEnd ? 32 : 64, isLowEnd ? 32 : 64);
const material = new THREE.MeshStandardMaterial({
    map: earthTexture, // Base color
    normalMap: earthNormal,
    roughness: 0.9, // Matte finish (no plastic shine)
    metalness: 0.1,
    color: 0x111111, // Very dark base
    emissive: 0x000000, // No global emission
    emissiveMap: earthTexture, // Use texture as emission source!
    emissiveIntensity: 0.3 // Continents will glow slightly
});
const globe = new THREE.Mesh(geometry, material);
globeGroup.add(globe);

// Atmosphere Glow (Subtle & Diffuse)
const atmosphereGeo = new THREE.SphereGeometry(2.6, isLowEnd ? 32 : 64, isLowEnd ? 32 : 64);
const atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0x1a4d8c, // Deep tech blue
    transparent: true,
    opacity: 0.08, // Very subtle
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending // Glow effect
});
const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
globeGroup.add(atmosphere);

// Clouds (Simple second sphere with transparency if we had a cloud texture, 
// but for now we'll use a subtle noise or just the atmosphere)
// Clouds/Atmosphere is enough. Removed wireframe overlay to avoid "blue rectangle" glitch look.

globeGroup.position.set(2, 0, -5);
globeGroup.rotation.y = -0.2;

// 2. Digital Tunnel (Particles - Stars)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = isLowEnd ? 800 : 2000; 
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50; 
    if (i % 3 === 2) posArray[i] = (Math.random() - 0.5) * 100; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xffffff, // White stars instead of blue particles
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Removed Floating Geometric Shapes to clean up the view

// 4. Vehicle (Simple Representation for Scrollytelling)
const vehicleGroup = new THREE.Group();
scene.add(vehicleGroup);

// Car Body
const carBodyGeo = new THREE.BoxGeometry(2, 0.5, 4);
const carBodyMat = new THREE.MeshStandardMaterial({ color: 0x0A84FF, roughness: 0.2, metalness: 0.8 });
const carBody = new THREE.Mesh(carBodyGeo, carBodyMat);
vehicleGroup.add(carBody);

// Wheels
const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const wheels = [];
[[-1.1, 0.2, 1.2], [1.1, 0.2, 1.2], [-1.1, 0.2, -1.2], [1.1, 0.2, -1.2]].forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(...pos);
    vehicleGroup.add(wheel);
    wheels.push(wheel);
});

// Initial Vehicle Position (Hidden)
vehicleGroup.position.set(0, -10, 0);

// --- Scroll Interaction & Scrollytelling Logic ---
let scrollY = 0;
let scrollPercent = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollPercent = scrollY / docHeight;
});

// --- Animation Loop ---
const animate = () => {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // 1. Camera Movement (The Journey)
    // Base movement
    const targetZ = -scrollY * 0.02;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.rotation.z = scrollY * 0.0002;
    camera.rotation.x = Math.sin(time * 0.5) * 0.05;

    // 2. Globe Animation (Hero Section)
    if (globeGroup) {
        globeGroup.rotation.y -= 0.002;

        // Apple-style Zoom Effect
        const zoomFactor = 1 + scrollY * 0.003;
        globeGroup.scale.setScalar(1.2 * zoomFactor);

        // Lock Z position relative to camera
        globeGroup.position.z = camera.position.z - 5;

        // Force center X
        globeGroup.position.x = 0;

        // Ensure camera looks at the globe
        camera.lookAt(globeGroup.position);

        // Fade logic
        const fadeStart = 200;
        const fadeEnd = 800;
        let opacity = 1;

        if (scrollY > fadeStart) {
            opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
        }

        globeGroup.children.forEach(child => {
            if (child.material) {
                // Fix: Removed reference to 'core' which was deleted
                // Apply opacity based on scroll fade
                child.material.opacity = Math.max(0, opacity); 
                child.material.transparent = true;
            }
        });

        globeGroup.visible = opacity > 0;
    }

    // 3. Vehicle Animation (Scrollytelling)
    // Vehicle appears after Hero section
    if (scrollPercent > 0.1) {
        // Move vehicle into view
        const targetY = -2 + Math.sin(time * 2) * 0.1; // Floating effect
        vehicleGroup.position.y += (targetY - vehicleGroup.position.y) * 0.05;

        // Move vehicle forward/backward based on scroll
        vehicleGroup.position.z = camera.position.z - 10;

        // Rotate wheels
        wheels.forEach(w => w.rotation.x -= 0.1);

        // Banking effect on turns
        vehicleGroup.rotation.z = Math.sin(time) * 0.05;

        vehicleGroup.visible = true;
    } else {
        vehicleGroup.position.y = -10; // Hide below
        vehicleGroup.visible = false;
    }

    // 4. Tunnel Effect
    particlesMesh.rotation.z += 0.001;
    // Move particles with camera to create infinite tunnel
    if (camera.position.z < particlesMesh.position.z - 50) {
        particlesMesh.position.z = camera.position.z;
    }

    // 5. Shapes Animation (Removed)
    // shapesGroup was removed to clean up the view

    // 6. Partners Globe Animation
    // 6. Partners Globe Animation
    if (partnersGlobeGroup) {
        // Auto rotation
        partnersGlobeGroup.rotation.y += 0.005;

        // Mouse interaction (simple look-at or rotation influence)
        const targetRotX = (mouseY - window.innerHeight / 2) * 0.001;
        const targetRotY = (mouseX - window.innerWidth / 2) * 0.001;

        partnersGlobeGroup.rotation.x += (targetRotX - partnersGlobeGroup.rotation.x) * 0.05;
        partnersGlobeGroup.rotation.y += (targetRotY - 0.005) * 0.05; // Blend auto and mouse

        // Visibility based on scroll (Partners section is near bottom)
        if (scrollPercent > 0.8) {
            partnersGlobeGroup.visible = true;
            // Float in
            partnersGlobeGroup.position.y += (0 - partnersGlobeGroup.position.y) * 0.05;
        } else {
            partnersGlobeGroup.visible = false;
            partnersGlobeGroup.position.y = -10;
        }
    }

    renderer.render(scene, camera);
};

// --- Mouse Interaction for Partners Globe ---
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 6. Partners Globe Setup
const partnersGlobeGroup = new THREE.Group();
scene.add(partnersGlobeGroup);

const pGlobeGeo = new THREE.IcosahedronGeometry(3, isLowEnd ? 0 : 1); // Reduce detail on low-end
const pGlobeMat = new THREE.MeshBasicMaterial({
    color: 0x2997ff,
    wireframe: true,
    transparent: true,
    opacity: 0.2
});
const partnersGlobeMesh = new THREE.Mesh(pGlobeGeo, pGlobeMat);
partnersGlobeGroup.add(partnersGlobeMesh);

// Add some connecting lines/network effect
const pDotsGeo = new THREE.BufferGeometry();
const pDotsCount = isLowEnd ? 50 : 100; // Reduce dots on low-end
const pDotsPos = new Float32Array(pDotsCount * 3);
for (let i = 0; i < pDotsCount * 3; i += 3) {
    const r = 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    pDotsPos[i] = r * Math.sin(phi) * Math.cos(theta);
    pDotsPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    pDotsPos[i + 2] = r * Math.cos(phi);
}
pDotsGeo.setAttribute('position', new THREE.BufferAttribute(pDotsPos, 3));
const pDotsMat = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
const pDots = new THREE.Points(pDotsGeo, pDotsMat);
partnersGlobeMesh.add(pDots);

partnersGlobeGroup.position.set(5, -10, -10); // Start hidden
// partnersGlobe = partnersGlobeGroup; // REMOVED: This was causing the crash. We should use partnersGlobeGroup in animate loop.

animate();

// --- Resize & Mobile Optimization ---
const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // Mobile Adjustments
    if (width < 768) {
        if (globeGroup) {
            globeGroup.scale.set(0.7, 0.7, 0.7);
            globeGroup.position.set(0, 1, -5);
        }
        if (particlesMesh) {
            particlesMesh.material.opacity = 0.3;
        }
    } else {
        if (globeGroup) {
            globeGroup.scale.set(1.2, 1.2, 1.2);
            globeGroup.position.set(0, 0, -5);
        }
        if (particlesMesh) {
            particlesMesh.material.opacity = 0.6;
        }
    }
};

window.addEventListener('resize', handleResize);

// Initial check
handleResize();

