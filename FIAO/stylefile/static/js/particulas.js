// Efecto de partículas para el banner (opcional)
function createParticles() {
    const banner = document.querySelector('.banner');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'banner-particles';
    banner.appendChild(particlesContainer);

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamaño y posición aleatorios
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${top}%;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Llamar la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', createParticles);