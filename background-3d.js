import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';

console.log('Global 3D Background initializing with Scrollytelling...');

const container = document.createElement('div');
container.id = 'global-3d-bg';
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100%';
container.style.height = '100%';
container.style.zIndex = '0';
container.style.pointerEvents = 'none'; // Allow clicks to pass through
document.body.prepend(container);

const scene = new THREE.Scene();
// Fog for depth
scene.fog = new THREE.FogExp2(0x000000, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high DPI
container.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x2997ff, 2, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// --- Assets ---
const textureLoader = new THREE.TextureLoader();

// 1. Hero Globe (Programmatic)
const globeGroup = new THREE.Group();
scene.add(globeGroup);

// Wireframe Sphere
const geometry = new THREE.IcosahedronGeometry(2.5, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x2997ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const globe = new THREE.Mesh(geometry, material);
globeGroup.add(globe);

// Inner Core (Solid dark sphere to block background)
const coreGeometry = new THREE.IcosahedronGeometry(2.4, 2);
const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
globeGroup.add(core);

// Glowing Dots (Cities)
const dotsGeometry = new THREE.BufferGeometry();
const dotsCount = 50;
const dotsPos = new Float32Array(dotsCount * 3);

for (let i = 0; i < dotsCount * 3; i += 3) {
    const r = 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    dotsPos[i] = r * Math.sin(phi) * Math.cos(theta);
    dotsPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    dotsPos[i + 2] = r * Math.cos(phi);
}

dotsGeometry.setAttribute('position', new THREE.BufferAttribute(dotsPos, 3));
const dotsMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x9e1eff,
    transparent: true,
    opacity: 0.8
});
const dots = new THREE.Points(dotsGeometry, dotsMaterial);
globeGroup.add(dots);

globeGroup.position.set(2, 0, -5);
globeGroup.rotation.y = -0.2;

// 2. Digital Tunnel (Particles)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50; // Spread out
    if (i % 3 === 2) posArray[i] = (Math.random() - 0.5) * 100; // Deep Z axis
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x2997ff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 3. Floating Geometric Shapes (For other sections)
const shapesGroup = new THREE.Group();
const geoGeometry = new THREE.IcosahedronGeometry(1, 0);
const geoMaterial = new THREE.MeshStandardMaterial({
    color: 0x1c1c1e,
    wireframe: true,
    emissive: 0x2997ff,
    emissiveIntensity: 0.5
});

for (let i = 0; i < 5; i++) {
    const mesh = new THREE.Mesh(geoGeometry, geoMaterial);
    mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        -20 - (i * 10)
    );
    shapesGroup.add(mesh);
}
scene.add(shapesGroup);

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
    // 2. Globe Animation (Hero Section)
    if (globeGroup) {
        globeGroup.rotation.y -= 0.002;

        // Apple-style Zoom Effect
        // Zoom in based on scroll
        const zoomFactor = 1 + scrollY * 0.003;
        globeGroup.scale.setScalar(1.2 * zoomFactor);

        // Lock Z position relative to camera to prevent flying past it
        // Keep it 5 units in front of the camera
        globeGroup.position.z = camera.position.z - 5;

        // Fade out as it gets too big (transition to next section)
        // Starts fading after 200px scroll, fully invisible by 800px
        const fadeStart = 200;
        const fadeEnd = 800;
        let opacity = 1;

        if (scrollY > fadeStart) {
            opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
        }

        // Apply opacity to all children materials
        globeGroup.children.forEach(child => {
            if (child.material) {
                child.material.opacity = Math.max(0, opacity * (child === core ? 1 : 0.3)); // Core is solid, others transparent
                child.material.transparent = true;
            }
        });

        globeGroup.visible = opacity > 0;

        // Center the globe for the zoom effect (override initial position)
        // Smoothly interpolate X position from 2 (initial) to 0 (centered)
        const centerProgress = Math.min(1, scrollY / 500);
        globeGroup.position.x = 2 * (1 - centerProgress);
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

    // 5. Shapes Animation
    shapesGroup.children.forEach((mesh, i) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        // Float up/down
        mesh.position.y += Math.sin(time + i) * 0.02;
    });

    // 6. Partners Globe Animation
    if (partnersGlobe) {
        // Auto rotation
        partnersGlobe.rotation.y += 0.005;

        // Mouse interaction (simple look-at or rotation influence)
        const targetRotX = (mouseY - window.innerHeight / 2) * 0.001;
        const targetRotY = (mouseX - window.innerWidth / 2) * 0.001;

        partnersGlobe.rotation.x += (targetRotX - partnersGlobe.rotation.x) * 0.05;
        partnersGlobe.rotation.y += (targetRotY - 0.005) * 0.05; // Blend auto and mouse

        // Visibility based on scroll (Partners section is near bottom)
        if (scrollPercent > 0.8) {
            partnersGlobe.visible = true;
            // Float in
            partnersGlobe.position.y += (0 - partnersGlobe.position.y) * 0.05;
        } else {
            partnersGlobe.visible = false;
            partnersGlobe.position.y = -10;
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

const pGlobeGeo = new THREE.IcosahedronGeometry(3, 1);
const pGlobeMat = new THREE.MeshBasicMaterial({
    color: 0x2997ff,
    wireframe: true,
    transparent: true,
    opacity: 0.2
});
const partnersGlobe = new THREE.Mesh(pGlobeGeo, pGlobeMat);
partnersGlobeGroup.add(partnersGlobe);

// Add some connecting lines/network effect
const pDotsGeo = new THREE.BufferGeometry();
const pDotsCount = 100;
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
partnersGlobe.add(pDots);

partnersGlobeGroup.position.set(5, -10, -10); // Start hidden
partnersGlobe = partnersGlobeGroup; // Re-assign for animation loop access

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

