// === 1. SELECCIONAR ELEMENTOS ===
const botonMenu = document.getElementById('mobile-menu');
const menu = document.querySelector('.nav-links');
const enlacesMenu = document.querySelectorAll('.nav-link');

// === 2. FUNCIÓN PRINCIPAL ===
function toggleMenu() {
    // Alterna entre abierto/cerrado
    botonMenu.classList.toggle('active');
    menu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Bloquea/desbloquea scroll
}

// === 3. EVENTOS ===

// A. Click en el botón hamburguesa
botonMenu.addEventListener('click', function(e) {
    e.stopPropagation(); // Evita que el click se propague
    toggleMenu();
});

// B. Cerrar menú al hacer clic en un enlace
enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', () => {
        botonMenu.classList.remove('active');
        menu.classList.remove('active');
                document.body.classList.remove('no-scroll');
    });
});

// C. Cerrar menú al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !botonMenu.contains(e.target)) {
        botonMenu.classList.remove('active');
        menu.classList.remove('active');
                document.body.classList.remove('no-scroll');
    }
});

// D. Cerrar menú al redimensionar (si vuelve a desktop)
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        botonMenu.classList.remove('active');
        menu.classList.remove('active');
                document.body.classList.remove('no-scroll');
    }
});