let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll Verso il Basso -> Nascondi
        navbar.classList.add('nav-hidden');
    } else {
        // Scroll Verso l'Alto -> Mostra
        navbar.classList.remove('nav-hidden');
    }
    
    // Aggiungi background scuro se non si è in cima
    if (scrollTop > 50) {
        navbar.style.background = 'rgba(5, 5, 5, 0.9)';
    } else {
        navbar.style.background = 'rgba(5, 5, 5, 0.6)';
    }

    lastScrollTop = scrollTop;
});