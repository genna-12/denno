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
});