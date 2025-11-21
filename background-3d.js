import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';

console.log('Global 3D Background initializing...');

const container = document.createElement('div');
container.id = 'global-3d-bg';
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100%';
container.style.height = '100%';
container.style.zIndex = '-1';
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

// Reference for animation
const vehicle = globeGroup; // Keep variable name for compatibility with animation loop

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


// --- Scroll Interaction ---
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// --- Animation Loop ---
const animate = () => {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Camera Flight Path based on Scroll
    // Map scrollY to Z position
    const targetZ = -scrollY * 0.02;

    // Smooth camera movement
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    // Slight rotation based on scroll
    camera.rotation.z = scrollY * 0.0002;
    camera.rotation.x = Math.sin(time * 0.5) * 0.05; // Breathing effect

    // Vehicle Animation
    if (vehicle) {
        vehicle.position.y = Math.sin(time) * 0.2;
        vehicle.rotation.y = -0.2 + Math.sin(time * 0.5) * 0.05;

        // Make vehicle follow camera slightly but stay in hero section
        // vehicle.position.z = camera.position.z - 5; 
    }

    // Particles Animation (Infinite Tunnel Effect)
    particlesMesh.rotation.z += 0.001;

    // Shapes Animation
    shapesGroup.children.forEach((mesh, i) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
};

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
        // Mobile: Smaller globe, moved up slightly
        if (globeGroup) {
            globeGroup.scale.set(0.7, 0.7, 0.7);
            globeGroup.position.set(0, 1, -5);
        }
        // Reduce particle density perception by lowering opacity
        if (particlesMesh) {
            particlesMesh.material.opacity = 0.3;
        }
    } else {
        // Desktop: Normal size, CENTERED (was offset to right)
        if (globeGroup) {
            globeGroup.scale.set(1.2, 1.2, 1.2); // Slightly larger for impact
            globeGroup.position.set(0, 0, -5); // Centered
        }
        if (particlesMesh) {
            particlesMesh.material.opacity = 0.6;
        }
    }
};

window.addEventListener('resize', handleResize);

// Initial check
handleResize();
