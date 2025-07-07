// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('threejs-canvas'),
    alpha: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// Position camera
camera.position.z = 5;

// Create wireframe sphere
const geometry = new THREE.SphereGeometry(2, 16, 16);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x0066ff,
    wireframe: true,
    transparent: true,
    opacity: 0.8
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Mouse control variables
let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;
let sphereRotationX = 0;
let sphereRotationY = 0;
let autoRotate = true;

// Mouse event listeners
document.addEventListener('mousedown', function(event) {
    isMouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    autoRotate = false; // Stop auto-rotation when user starts controlling
});

document.addEventListener('mouseup', function(event) {
    isMouseDown = false;
    autoRotate = true; // Resume auto-rotation when user stops controlling
});

document.addEventListener('mousemove', function(event) {
    if (isMouseDown) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;
        
        sphereRotationY += deltaX * 0.01;
        sphereRotationX += deltaY * 0.01;
        
        sphere.rotation.x = sphereRotationX;
        sphere.rotation.y = sphereRotationY;
        
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Auto-rotate when not being controlled
    if (autoRotate) {
        sphere.rotation.x += 0.003;
        sphere.rotation.y += 0.003;
        sphereRotationX = sphere.rotation.x;
        sphereRotationY = sphere.rotation.y;
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start animation
animate();

// Menu toggle function
function toggleMenu() {
    const circleMenu = document.getElementById('circleMenu');
    circleMenu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const circleMenu = document.getElementById('circleMenu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (!circleMenu.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        circleMenu.classList.remove('active');
    }
}); 