/**
 * CONTACT PAGE LOGIC
 * Gestisce l'invio mail tramite EmailJS e le interazioni del form
 */

(function() {
    // 1. INIZIALIZZAZIONE (Sostituisci con la tua chiave pubblica)
    emailjs.init("YOUR_PUBLIC_KEY");

    document.addEventListener('DOMContentLoaded', () => {
        const contactForm = document.getElementById('vfx-form');
        if (!contactForm) return;

        const btn = contactForm.querySelector('.btn-primary');
        const btnText = btn.querySelector('.btn-text');
        const inputs = document.querySelectorAll('.input-group input, .input-group textarea');

        // 2. CURSORE INTERATTIVO SUGLI INPUT
        // Sfrutta la classe .cursor-active definita nel tuo main.js
        inputs.forEach(input => {
            input.addEventListener('focus', () => document.body.classList.add('cursor-active'));
            input.addEventListener('blur', () => document.body.classList.remove('cursor-active'));
            
            // Mantiene la label su se c'è testo
            input.addEventListener('input', () => {
                input.value.length > 0 
                    ? input.parentElement.classList.add('has-content') 
                    : input.parentElement.classList.remove('has-content');
            });
        });

        // 3. LOGICA INVIO MAIL
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Effetto visivo "Processing"
            btn.style.pointerEvents = 'none';
            btnText.innerHTML = "UPLOADING...";
            btn.style.borderColor = "var(--glow)";

            // Invio reale
            emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', '#vfx-form')
                .then(() => {
                    showStatus(btn, btnText, "RENDER COMPLETE", "var(--glow)");
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    showStatus(btn, btnText, "ERROR 404", "#ff4444");
                });
        });
    });

    // Funzione di utilità per il feedback del tasto
    function showStatus(btn, btnText, message, color) {
        btnText.innerHTML = message;
        btn.style.borderColor = color;
        btn.style.color = color;

        setTimeout(() => {
            btnText.innerHTML = "PUSH TO START";
            btn.style.borderColor = "var(--text-main)";
            btn.style.color = "var(--text-main)";
            btn.style.pointerEvents = 'all';
        }, 4000);
    }
})();