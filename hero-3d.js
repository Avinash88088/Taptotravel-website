import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';

console.log('Hero 3D script loaded');

const container = document.getElementById('hero-3d');

if (container) {
    console.log('Hero 3D container found');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x2997ff, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x9e1eff, 2);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Vehicle Plane
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        'hero-vehicle-premium.png',
        (texture) => {
            console.log('Texture loaded successfully');
            const geometry = new THREE.PlaneGeometry(7, 5);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            const vehicle = new THREE.Mesh(geometry, material);
            scene.add(vehicle);

            // Animation Loop for Vehicle
            const animateVehicle = () => {
                requestAnimationFrame(animateVehicle);
                vehicle.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
                vehicle.position.y = Math.sin(Date.now() * 0.002) * 0.2;
                renderer.render(scene, camera);
            };
            animateVehicle();
        },
        undefined,
        (err) => {
            console.error('Error loading texture:', err);
            // Fallback: Add a simple glowing sphere if texture fails
            const geometry = new THREE.SphereGeometry(2, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0x2997ff,
                roughness: 0.4,
                metalness: 0.6
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            const animateSphere = () => {
                requestAnimationFrame(animateSphere);
                sphere.rotation.y += 0.01;
                renderer.render(scene, camera);
            };
            animateSphere();
        }
    );

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x2997ff,
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 6;

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
} else {
    console.error('Hero 3D container NOT found');
}
