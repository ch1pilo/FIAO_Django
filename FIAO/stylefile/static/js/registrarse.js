// Mostrar/ocultar suscripciones cuando cambia el checkbox
const esVendedorCheckbox = document.getElementById('es_vendedor');
const suscripcionesSection = document.getElementById('suscripcionesSection');
const planSeleccionadoInput = document.getElementById('plan_seleccionado');
const precioSeleccionadoInput = document.getElementById('precio_seleccionado');
const tarjetasSuscripcion = document.querySelectorAll('.tarjeta-suscripcion');

esVendedorCheckbox.addEventListener('change', function() {
    if (this.checked) {
        suscripcionesSection.style.display = 'block';
    } else {
        suscripcionesSection.style.display = 'none';
        planSeleccionadoInput.value = '';
        precioSeleccionadoInput.value = '';
        // Quitar selección de tarjetas
        tarjetasSuscripcion.forEach(tarjeta => {
            tarjeta.classList.remove('seleccionada');
        });
    }
});

// Seleccionar plan de suscripción
tarjetasSuscripcion.forEach(tarjeta => {
    tarjeta.addEventListener('click', function() {
        // Quitar selección de todas
        tarjetasSuscripcion.forEach(t => t.classList.remove('seleccionada'));
        // Seleccionar esta
        this.classList.add('seleccionada');
        planSeleccionadoInput.value = this.getAttribute('data-plan');
        precioSeleccionadoInput.value = this.getAttribute('data-precio');
    });
});

// Validación de contraseñas
document.querySelector('form').addEventListener('submit', function(e) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    
    if (password !== confirmPassword) {
        e.preventDefault();
        alert('Las contraseñas no coinciden');
        return false;
    }
    
    // Validar que vendedores seleccionen un plan
    if (esVendedorCheckbox.checked && !planSeleccionadoInput.value) {
        e.preventDefault();
        alert('Por favor selecciona un plan de suscripción');
        return false;
    }
});