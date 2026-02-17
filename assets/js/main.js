document.addEventListener('DOMContentLoaded', () => {

    /* 1. INIT LOTTIE ANIMATION */
    // Carica l'animazione della firma
    const animation = lottie.loadAnimation({
        container: document.getElementById('lottie-signature'),
        renderer: 'svg',
        loop: false, // Esegui una sola volta
        autoplay: true, // Parte subito
        path: 'assets/lottie/firma.json' // Assicurati di avere il file JSON qui
    });

    // Opzionale: rallenta leggermente per eleganza
    animation.setSpeed(0.8);



    /* 2. SCROLL REVEAL ANIMATIONS */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Attiva quando il 15% dell'elemento è visibile
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animazione one-shot
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    elementsToReveal.forEach(el => observer.observe(el));

    const trailLength = 12; // Numero di "pallini" nella scia
    const trailElements = [];
    let mouseX = 0;
    let mouseY = 0;

    // Creazione dinamica degli elementi della scia
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        document.body.appendChild(dot);

        trailElements.push({
            el: dot,
            x: 0,
            y: 0,
            // Calcola scala e opacità in base alla posizione nella coda
            scale: 1 - (i / trailLength),
            opacity: (1 - (i / trailLength))
        });
    }


    // Customize cursor
    // Aggiorna costantemente la posizione del mouse
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Loop di animazione fluido (60fps)
    const animateTrail = () => {
        trailElements.forEach((dot, index) => {
            // Logica "Follow the leader":
            // Il primo punto segue il mouse, gli altri seguono il punto precedente.

            // Speed: il primo è veloce (1), gli altri hanno un leggero ritardo (0.4)
            const speed = index === 0 ? 1 : 0.45;

            const targetX = index === 0 ? mouseX : trailElements[index - 1].x;
            const targetY = index === 0 ? mouseY : trailElements[index - 1].y;

            // Interpolazione Lineare (LERP) per movimento morbido
            dot.x += (targetX - dot.x) * speed;
            dot.y += (targetY - dot.y) * speed;

            // Applica le trasformazioni CSS
            dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${dot.scale})`;
            dot.el.style.opacity = dot.opacity;
        });

        requestAnimationFrame(animateTrail);
    };

    // =================================================================
    // 5. GESTIONE INTERATTIVA CURSORE (BIANCO -> CIANO)
    // =================================================================

    // Selezioniamo tutti gli elementi che devono far cambiare colore al cursore
    // a = link, button = bottoni, .service-card = card servizi, .work-item = lavori
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .work-item, .lang-switcher');

    interactiveElements.forEach(el => {
        // Quando entri nell'elemento -> Aggiungi classe al body
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
        });

        // Quando esci dall'elemento -> Rimuovi classe dal body
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
        });
    });

    // Avvia l'animazione del cursore
    animateTrail();
});
