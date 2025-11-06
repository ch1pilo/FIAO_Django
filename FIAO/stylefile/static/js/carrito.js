// Carrito functionality
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const finalizarCompraBtn = document.getElementById('finalizar-compra');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total = 0;

// Inicializar carrito
actualizarCarrito();

// Abrir carrito
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
});

// Cerrar carrito
closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Agregar al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productoId = e.target.getAttribute('data-producto-id');
        const productoCard = e.target.closest('.product-card');
        const nombre = productoCard.querySelector('.product-name').textContent;
        const precio = parseFloat(productoCard.querySelector('.product-price').textContent.replace('$', ''));
        const imagen = productoCard.querySelector('.product-image')?.src || '';
        
        agregarAlCarrito(productoId, nombre, precio, imagen);
    });
});

function agregarAlCarrito(id, nombre, precio, imagen) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
        productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
    } else {
        carrito.push({ 
            id, 
            nombre, 
            precio, 
            imagen,
            cantidad: 1,
            subtotal: precio
        });
    }
    
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion(`✅ ${nombre} agregado al carrito`);
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad < 1) {
        eliminarDelCarrito(id);
        return;
    }
    
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.cantidad = nuevaCantidad;
        producto.subtotal = producto.precio * nuevaCantidad;
        guardarCarrito();
        actualizarCarrito();
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarCarrito() {
    // Calcular total
    total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Actualizar contador
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Actualizar items del carrito
    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = carrito.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.imagen ? `<img src="${item.imagen}" alt="${item.nombre}">` : '<i class="fas fa-box"></i>'}
                </div>
                <div class="cart-item-info">
                    <strong>${item.nombre}</strong>
                    <p>$${item.precio.toFixed(2)} c/u</p>
                    <div class="cart-item-controls">
                        <button class="btn-quantity" onclick="actualizarCantidad('${item.id}', ${item.cantidad - 1})">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-quantity" onclick="actualizarCantidad('${item.id}', ${item.cantidad + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <p>$${item.subtotal.toFixed(2)}</p>
                    <button class="btn-remove" onclick="eliminarDelCarrito('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function mostrarNotificacion(mensaje) {
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notification';
    notificacion.innerHTML = `
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Finalizar compra
if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener('click', () => {
        if (carrito.length === 0) {
            mostrarNotificacion('❌ Tu carrito está vacío');
            return;
        }
        
        // Simular pasarela de pago
        simularPasarelaPago();
    });
}

function simularPasarelaPago() {
    // Aquí iría la integración con tu pasarela de pago real
    // Por ahora simulamos el proceso
    
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    
    setTimeout(() => {
        mostrarNotificacion('🔐 Redirigiendo a pasarela de pago...');
        
        setTimeout(() => {
            // Simular pago exitoso
            mostrarNotificacion('✅ Pago procesado exitosamente');
            
            // Limpiar carrito después del pago
            carrito = [];
            guardarCarrito();
            actualizarCarrito();
            
            // Aquí podrías redirigir a una página de confirmación
            // window.location.href = '/confirmacion-pago/';
            
        }, 2000);
    }, 1000);
}

// Cerrar carrito al hacer clic en el overlay
overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Hacer funciones globales para los botones
window.eliminarDelCarrito = eliminarDelCarrito;
window.actualizarCantidad = actualizarCantidad;


// JavaScript para los métodos de pago
document.addEventListener('DOMContentLoaded', function() {
    const paymentModal = document.getElementById('payment-modal');
    const closePayment = document.getElementById('close-payment');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentForms = document.querySelectorAll('.payment-form');
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');

    // Abrir modal de pago cuando se hace clic en "Finalizar Compra"
    document.getElementById('finalizar-compra').addEventListener('click', function() {
        if (carrito.length === 0) {
            mostrarNotificacion('❌ Tu carrito está vacío');
            return;
        }
        
        // Cerrar carrito y abrir modal de pago
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        
        // Actualizar resumen del pedido
        actualizarResumenPedido();
        
        // Mostrar modal de pago
        setTimeout(() => {
            paymentModal.classList.add('active');
        }, 300);
    });

    // Cerrar modal de pago
    closePayment.addEventListener('click', function() {
        paymentModal.classList.remove('active');
        resetPaymentForms();
    });

    // Seleccionar método de pago
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remover selección anterior
            paymentMethods.forEach(m => m.classList.remove('selected'));
            // Ocultar todos los formularios
            paymentForms.forEach(form => form.classList.remove('active'));
            
            // Seleccionar método actual
            this.classList.add('selected');
            const methodType = this.getAttribute('data-method');
            
            // Mostrar formulario correspondiente
            document.getElementById(`form-${methodType}`).classList.add('active');
            
            // Actualizar montos en los botones de pago
            actualizarMontosPago();
        });
    });

    // Procesar pagos
    document.getElementById('pay-card')?.addEventListener('click', procesarPagoTarjeta);
    document.getElementById('pay-paypal')?.addEventListener('click', procesarPagoPayPal);
    document.getElementById('confirm-transfer')?.addEventListener('click', procesarTransferencia);
    document.getElementById('confirm-cash')?.addEventListener('click', procesarEfectivo);

    function actualizarResumenPedido() {
        orderItems.innerHTML = carrito.map(item => `
            <div class="order-item">
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${item.subtotal.toFixed(2)}</span>
            </div>
        `).join('');
        
        orderTotal.textContent = total.toFixed(2);
    }

    function actualizarMontosPago() {
        document.querySelectorAll('.btn-pay').forEach(btn => {
            const amountSpan = btn.querySelector('span');
            if (amountSpan) {
                amountSpan.textContent = total.toFixed(2);
            }
        });
    }

    function procesarPagoTarjeta() {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCVV = document.getElementById('card-cvv').value;
        const cardName = document.getElementById('card-name').value;

        if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
            mostrarNotificacion('❌ Completa todos los campos de la tarjeta');
            return;
        }

        mostrarNotificacion('💳 Procesando pago con tarjeta...');
        simularProcesoPago('tarjeta');
    }

    function procesarPagoPayPal() {
        mostrarNotificacion('🔗 Redirigiendo a PayPal...');
        simularProcesoPago('paypal');
    }

    function procesarTransferencia() {
        mostrarNotificacion('🏦 Confirmando transferencia...');
        simularProcesoPago('transferencia');
    }

    function procesarEfectivo() {
        mostrarNotificacion('💵 Confirmando pago en efectivo...');
        simularProcesoPago('efectivo');
    }

    function simularProcesoPago(metodo) {
        paymentModal.classList.remove('active');
        
        setTimeout(() => {
            mostrarNotificacion('✅ Pago procesado exitosamente');
            
            // Limpiar carrito después del pago exitoso
            carrito = [];
            guardarCarrito();
            actualizarCarrito();
            
            // Aquí podrías redirigir a una página de confirmación
            // window.location.href = '/confirmacion-pago/';
            
        }, 2000);
    }

    function resetPaymentForms() {
        paymentMethods.forEach(m => m.classList.remove('selected'));
        paymentForms.forEach(form => form.classList.remove('active'));
        
        // Limpiar campos de formulario
        document.querySelectorAll('.payment-form input').forEach(input => {
            input.value = '';
        });
    }

    // Generar número de pedido aleatorio
    document.getElementById('order-number').textContent = 
        Math.floor(1000 + Math.random() * 9000);
});