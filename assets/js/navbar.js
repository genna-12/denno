const navbar = document.getElementById('navbar');
const langSwitcher = document.getElementById('langToggle'); // Selezioniamo lo switcher
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 1. Gestione Background Navbar
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 2. Gestione Hide/Show (Navbar e Lang Switcher)
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll verso il BASSO: nascondi tutto
        navbar.classList.add('nav-hidden');
        langSwitcher.style.transform = 'translateY(150%)'; // Sposta fuori schermo
        langSwitcher.style.opacity = '0';
    } else {
        // Scroll verso l'ALTO: mostra tutto
        navbar.classList.remove('nav-hidden');
        langSwitcher.style.transform = 'translateY(0)';
        langSwitcher.style.opacity = '1';
    }
    
    // Aggiungiamo una transizione fluida allo switcher in style.css se non c'è
    langSwitcher.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; //

    lastScrollTop = scrollTop;
});