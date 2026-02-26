const translations = {
    it: {
        nav_home: "Home",
        nav_portfolio: "Portfolio",
        nav_about: "About",
        nav_contact: "Contatti",
        hero_tagline: "Visual Effects & Digital Storytelling",
        serv_1_title: "Videomaking",
        serv_1_desc: "Cinematic storytelling e produzione video high-end per brand e narrazioni visive.",
        serv_2_title: "3D Animations",
        serv_2_desc: "Motion graphics avanzata e ambienti tridimensionali fotorealistici.",
        serv_3_title: "Visual Effects",
        serv_3_desc: "Compositing professionale, simulazioni particellari e integrazione CGI.",
        works_title: "Lavori Selezionati",
        work_1: "Progetto Alpha",
        work_2: "Nebula Core",
        btn_full_portfolio: "Vedi Portfolio Completo",
        contact_title: "PRONTO A",
        contact_title_glow: "CREARE?",
        contact_subtitle: "Disponibile per collaborazioni freelance e progetti high-end. Analizzo ogni brief entro 24 ore.",
        contact_label_name: "NOME / STUDIO",
        contact_label_email: "EMAIL",
        contact_label_message: "IL TUO BRIEF",
        contact_btn: "PUSH TO START",
        contact_location: "POSIZIONE",
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
        nav_portfolio: "Portfolio",
        nav_about: "About",
        nav_contact: "Contact",
        hero_tagline: "Visual Effects & Digital Storytelling",
        serv_1_title: "Videomaking",
        serv_1_desc: "High-end cinematic storytelling and video production for brands and visual narratives.",
        serv_2_title: "3D Animations",
        serv_2_desc: "Advanced motion graphics and photorealistic 3D environments.",
        serv_3_title: "Visual Effects",
        serv_3_desc: "Professional compositing, particle simulations, and CGI integration.",
        works_title: "Selected Works",
        work_1: "Project Alpha",
        work_2: "Nebula Core",
        btn_full_portfolio: "View Full Portfolio",
        contact_title: "READY TO",
        contact_title_glow: "CREATE?",
        contact_subtitle: "Available for freelance collaborations and high-end projects. I analyze every brief within 24 hours.",
        contact_label_name: "NAME / STUDIO",
        contact_label_email: "EMAIL",
        contact_label_message: "YOUR BRIEF",
        contact_btn: "PUSH TO START",
        contact_location: "LOCATION",
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

document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('langToggle');
    const currentLangSpan = document.getElementById('currentLang');
    
    // Check localStorage or default to 'it'
    let currentLang = localStorage.getItem('siteLang') || 'it';
    
    // Initial Render
    updateLanguage(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'it' ? 'en' : 'it';
        
        // Apply flip animation to the language icon
        const langIcon = document.querySelector('.lang-icon');
        if (langIcon) {
            langIcon.classList.remove('lang-flip');
            // Force reflow to restart animation
            void langIcon.offsetWidth;
            langIcon.classList.add('lang-flip');
        }
        
        updateLanguage(currentLang);
        localStorage.setItem('siteLang', currentLang);
    });

    function updateLanguage(lang) {
        // Update texts
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Fade effect per cambio testo elegante
                element.style.opacity = 0;
                setTimeout(() => {
                    element.textContent = translations[lang][key];
                    element.style.opacity = 1;
                }, 200);
            }
        });

        // Update Toggle Text
        currentLangSpan.textContent = lang.toUpperCase();
    }
});