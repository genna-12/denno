document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. PARTICLE CANVAS BACKGROUND
       ========================================= */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        // Resize canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Create particles
        function initParticles() {
            particles = [];
            const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Connect particles with lines
        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Animation loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
    }
    
    
    /* =========================================
       2. SCROLL REVEAL ANIMATIONS
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special logic for footer
                if (entry.target.classList.contains('main-footer')) {
                    const footerBottom = document.querySelector('.footer-bottom');
                    if (footerBottom) {
                        setTimeout(() => {
                            footerBottom.classList.add('visible');
                        }, 150);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    
    
    /* =========================================
       3. CUSTOM CURSOR TRAIL (from main.js)
       ========================================= */
    const trailLength = 12;
    const trailElements = [];
    let mouseX = 0;
    let mouseY = 0;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        document.body.appendChild(dot);
        
        trailElements.push({
            el: dot,
            x: 0,
            y: 0,
            scale: 1 - (i / trailLength),
            opacity: (1 - (i / trailLength))
        });
    }
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailElements.forEach((dot, index) => {
            const speed = index === 0 ? 1 : 0.45;
            const targetX = index === 0 ? mouseX : trailElements[index - 1].x;
            const targetY = index === 0 ? mouseY : trailElements[index - 1].y;
            
            dot.x += (targetX - dot.x) * speed;
            dot.y += (targetY - dot.y) * speed;
            
            dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${dot.scale})`;
            dot.el.style.opacity = dot.opacity;
        });
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
    
    
    /* =========================================
       4. 3D TILT EFFECT FOR CARDS
       ========================================= */
    const tiltCards = document.querySelectorAll('.portfolio-item');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    });
    
    
    /* =========================================
       5. FILTER SYSTEM
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const emptyState = document.getElementById('empty-state');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            let visibleCount = 0;
            
            portfolioItems.forEach((item, index) => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    // Show item
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        item.classList.add('visible');
                        item.style.display = 'block';
                    }, index * 50);
                    visibleCount++;
                } else {
                    // Hide item
                    item.classList.add('hidden');
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
            
            // Show empty state if no items
            if (visibleCount === 0) {
                emptyState.classList.add('visible');
            } else {
                emptyState.classList.remove('visible');
            }
        });
    });
    
    
    /* =========================================
       6. PROJECT MODAL
       ========================================= */
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    // Project data
    const projectData = {
        'project-1': {
            title: 'Cinematic Reel',
            category: 'VIDEO',
            desc: 'Showreel 2024 - A collection of the best video projects showcasing storytelling and production skills.',
            client: 'Personal',
            year: '2024',
            role: 'Director, Editor, Colorist'
        },
        'project-2': {
            title: 'Nebula Core',
            category: '3D',
            desc: 'Environment Design - A futuristic space station designed in Blender with procedural materials.',
            client: 'Concept Art',
            year: '2024',
            role: '3D Artist'
        },
        'project-3': {
            title: 'Particle Storm',
            category: 'VFX',
            desc: 'Compositing & Simulation - Advanced particle systems created in Houdini with Nuke compositing.',
            client: 'Studio VFX',
            year: '2024',
            role: 'VFX Artist'
        },
        'project-4': {
            title: 'Kinetic Type',
            category: 'MOTION GRAPHICS',
            desc: 'Typography Animation - Dynamic text animations for music videos and commercials.',
            client: 'Various',
            year: '2024',
            role: 'Motion Designer'
        },
        'project-5': {
            title: 'Brand Story',
            category: 'VIDEO',
            desc: 'Commercial Production - Full service video production for brand campaigns.',
            client: 'Multiple Brands',
            year: '2024',
            role: 'Director, DP'
        },
        'project-6': {
            title: 'Character Study',
            category: '3D',
            desc: 'Digital Sculpture - Character designs created in ZBrush and Maya.',
            client: 'Personal',
            year: '2023',
            role: '3D Character Artist'
        },
        'project-7': {
            title: 'Match Move',
            category: 'VFX',
            desc: 'Tracking & Integration - Precise camera tracking and CGI integration.',
            client: 'Film Production',
            year: '2023',
            role: 'Compositor'
        },
        'project-8': {
            title: 'Logo Animation',
            category: 'MOTION GRAPHICS',
            desc: 'Brand Identity - Animated logos and brand reveals for various clients.',
            client: 'Various',
            year: '2023',
            role: 'Motion Designer'
        }
    };
    
    // Open modal on item click
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.closest('.portfolio-item').querySelector('.project-title').textContent.toLowerCase().replace(/\s+/g, '-');
            const projectKey = Object.keys(projectData).find(key => 
                projectData[key].title.toLowerCase().replace(/\s+/g, '-') === projectId
            ) || 'project-1';
            
            const data = projectData[projectKey] || projectData['project-1'];
            
            document.getElementById('modal-category').textContent = data.category;
            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-desc').textContent = data.desc;
            document.getElementById('modal-client').textContent = data.client;
            document.getElementById('modal-year').textContent = data.year;
            document.getElementById('modal-role').textContent = data.role;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    
    /* =========================================
       7. CURSOR ACTIVE STATE
       ========================================= */
    const interactiveElements = document.querySelectorAll(
        'a, button, .filter-btn, .portfolio-item, .lang-switcher, #back-to-top'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
        });
    });
    
    
    /* =========================================
       8. BACK TO TOP
       ========================================= */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Footer reveal on scroll
    window.addEventListener('scroll', () => {
        const footer = document.getElementById('final-footer');
        const footerBottom = document.querySelector('.footer-bottom');
        
        if (footer && footerBottom) {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - 100;
            
            if (scrollPosition >= threshold) {
                if (!footerBottom.classList.contains('reveal-now')) {
                    setTimeout(() => {
                        footerBottom.classList.add('reveal-now');
                    }, 150);
                }
            }
        }
    });
});

/* =========================================
   9. LANGUAGE TRANSLATIONS (Inline for portfolio)
   ========================================= */
// Translations are handled by language.js, but we add portfolio-specific ones
const portfolioTranslations = {
    it: {
        nav_home: "Home",
        portfolio_label: "LAVORI CREATIVI",
        portfolio_title: "PORTFOLIO",
        portfolio_subtitle: "Visual Effects • 3D • Motion Design",
        filter_all: "Tutti",
        filter_video: "Video",
        filter_3d: "3D",
        filter_vfx: "VFX",
        filter_motion: "Motion Graphics",
        project_1_title: "Cinematic Reel",
        project_1_desc: "Showreel 2024",
        project_2_title: "Nebula Core",
        project_2_desc: "Environment Design",
        project_3_title: "Particle Storm",
        project_3_desc: "Compositing & Simulation",
        project_4_title: "Kinetic Type",
        project_4_desc: "Typography Animation",
        project_5_title: "Brand Story",
        project_5_desc: "Commercial Production",
        project_6_title: "Character Study",
        project_6_desc: "Digital Sculpture",
        project_7_title: "Match Move",
        project_7_desc: "Tracking & Integration",
        project_8_title: "Logo Animation",
        project_8_desc: "Brand Identity",
        empty_state: "Nessun progetto in questa categoria",
        cta_label: "COLLABORAZIONE",
        cta_title: "HAI UN PROGETTO IN MENTE?",
        cta_desc: "Disponibile per freelance e collaborazioni creative.",
        cta_btn: "CONTATTAMI"
    },
    en: {
        nav_home: "Home",
        portfolio_label: "CREATIVE WORKS",
        portfolio_title: "PORTFOLIO",
        portfolio_subtitle: "Visual Effects • 3D • Motion Design",
        filter_all: "All",
        filter_video: "Video",
        filter_3d: "3D",
        filter_vfx: "VFX",
        filter_motion: "Motion Graphics",
        project_1_title: "Cinematic Reel",
        project_1_desc: "Showreel 2024",
        project_2_title: "Nebula Core",
        project_2_desc: "Environment Design",
        project_3_title: "Particle Storm",
        project_3_desc: "Compositing & Simulation",
        project_4_title: "Kinetic Type",
        project_4_desc: "Typography Animation",
        project_5_title: "Brand Story",
        project_5_desc: "Commercial Production",
        project_6_title: "Character Study",
        project_6_desc: "Digital Sculpture",
        project_7_title: "Match Move",
        project_7_desc: "Tracking & Integration",
        project_8_title: "Logo Animation",
        project_8_desc: "Brand Identity",
        empty_state: "No projects in this category",
        cta_label: "COLLABORATION",
        cta_title: "HAVE A PROJECT IN MIND?",
        cta_desc: "Available for freelance and creative collaborations.",
        cta_btn: "CONTACT ME"
    }
};

// Merge translations with main language.js
if (typeof translations !== 'undefined') {
    Object.assign(translations.it, portfolioTranslations.it);
    Object.assign(translations.en, portfolioTranslations.en);
}
