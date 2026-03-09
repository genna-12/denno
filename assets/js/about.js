// =====================================================
// ABOUT PAGE - INTERACTIVE EFFECTS
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initCounters();
    initGlitchEffect();
    initScrollReveal();
});

// --- THREE.JS PARTICLE SYSTEM ---
function initThreeJS() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.005
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material
    const material = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.1
    });

    // Create geometry for lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * 6); // Max connections
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const positions = particles.geometry.attributes.position.array;
        
        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            // Boundary check
            if (Math.abs(positions[i * 3]) > 5) velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 5) velocities[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 5) velocities[i].z *= -1;
        }

        particles.geometry.attributes.position.needsUpdate = true;

        // Mouse influence
        particles.rotation.x += (mouseY * 0.1 - particles.rotation.x) * 0.05;
        particles.rotation.y += (mouseX * 0.1 - particles.rotation.y) * 0.05;

        // Update connecting lines
        updateLines(positions, linePositions, particleCount);
        lines.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function updateLines(positions, linePositions, particleCount) {
    let lineIndex = 0;
    const maxLines = particleCount * 3;
    const maxDistance = 1.5;

    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < maxDistance && lineIndex < maxLines) {
                linePositions[lineIndex++] = positions[i * 3];
                linePositions[lineIndex++] = positions[i * 3 + 1];
                linePositions[lineIndex++] = positions[i * 3 + 2];
                linePositions[lineIndex++] = positions[j * 3];
                linePositions[lineIndex++] = positions[j * 3 + 1];
                linePositions[lineIndex++] = positions[j * 3 + 2];
            }
        }
    }

    // Clear remaining positions
    for (let i = lineIndex; i < linePositions.length; i++) {
        linePositions[i] = 0;
    }
}

// --- COUNTER ANIMATION ---
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        element.textContent = current + '+';

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + '+';
        }
    }

    requestAnimationFrame(update);
}

// --- GLITCH EFFECT ---
function initGlitchEffect() {
    const profileGlitch = document.getElementById('profileGlitch');
    if (!profileGlitch) return;

    // Random glitch on hover
    profileGlitch.addEventListener('mouseenter', () => {
        const layers = profileGlitch.querySelectorAll('.glitch-layer');
        layers.forEach(layer => {
            layer.style.opacity = '0.5';
        });
    });

    profileGlitch.addEventListener('mouseleave', () => {
        const layers = profileGlitch.querySelectorAll('.glitch-layer');
        layers.forEach(layer => {
            layer.style.opacity = '0';
        });
    });

    // Random glitch on scroll
    let scrollGlitchTimeout;
    window.addEventListener('scroll', () => {
        if (scrollGlitchTimeout) return;
        
        scrollGlitchTimeout = setTimeout(() => {
            scrollGlitchTimeout = null;
        }, 200);

        // Random glitch trigger
        if (Math.random() > 0.95) {
            const layers = profileGlitch.querySelectorAll('.glitch-layer');
            layers.forEach(layer => {
                layer.style.opacity = '0.3';
            });
            
            setTimeout(() => {
                layers.forEach(layer => {
                    layer.style.opacity = '0';
                });
            }, 100);
        }
    });
}

// --- SCROLL REVEAL (Enhanced) ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// --- PARALLAX EFFECT FOR VISUAL ---
window.addEventListener('mousemove', (e) => {
    const visual = document.querySelector('.about-visual');
    if (!visual) return;

    const x = (window.innerWidth / 2 - e.clientX) * 0.02;
    const y = (window.innerHeight / 2 - e.clientY) * 0.02;

    visual.style.transform = `translate(${x}px, ${y}px)`;
});

