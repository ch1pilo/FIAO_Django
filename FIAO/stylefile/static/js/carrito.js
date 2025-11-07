// Carrito functionality
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const finalizarCompraBtn = document.getElementById('finalizar-compra');
const paymentModal = document.getElementById('payment-modal');
const closePayment = document.getElementById('close-payment');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total = 0;

// Inicializar carrito
actualizarCarrito();

// Abrir carrito
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.style.display = 'block';
});

// Cerrar carrito
closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.style.display = 'none';
});

// Agregar al carrito
document.querySelectorAll('.btn-add-cart').forEach(button => {
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
    mostrarNotificacion('🗑️ Producto eliminado del carrito');
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
    total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    cartTotal.textContent = total.toFixed(2);
    
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
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
                    ${item.imagen ? `<img src="${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` : '<div style="width: 60px; height: 60px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;"><i class="fas fa-box" style="color: #666;"></i></div>'}
                </div>
                <div class="cart-item-info">
                    <strong style="display: block; margin-bottom: 5px; color: #351a69;">${item.nombre}</strong>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">$${item.precio.toFixed(2)} c/u</p>
                    <div class="cart-item-controls" style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                        <button class="btn-quantity" onclick="actualizarCantidad('${item.id}', ${item.cantidad - 1})" style="background: #522aa5; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
                        <span style="font-weight: bold;">${item.cantidad}</span>
                        <button class="btn-quantity" onclick="actualizarCantidad('${item.id}', ${item.cantidad + 1})" style="background: #522aa5; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
                    </div>
                </div>
                <div class="cart-item-total" style="text-align: right;">
                    <p style="margin: 0; font-weight: bold; color: #522aa5;">$${item.subtotal.toFixed(2)}</p>
                    <button class="btn-remove" onclick="eliminarDelCarrito('${item.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer; margin-top: 5px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notification';
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notificacion.innerHTML = `<span>${mensaje}</span>`;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Finalizar compra - ABRIR MODAL DE PAGO
if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener('click', () => {
        if (carrito.length === 0) {
            mostrarNotificacion('❌ Tu carrito está vacío');
            return;
        }
        
        cartSidebar.classList.remove('active');
        overlay.style.display = 'none';
        
        actualizarResumenPedido();
        
        setTimeout(() => {
            paymentModal.style.display = 'flex';
        }, 300);
    });
}

// Cerrar carrito al hacer clic en el overlay
overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.style.display = 'none';
});

// === FUNCIONES GLOBALES PARA EL CARRITO ===
window.eliminarDelCarrito = eliminarDelCarrito;
window.actualizarCantidad = actualizarCantidad;

// === FUNCIONES PARA EL MODAL DE PAGO ===

// Cerrar modal de pago
closePayment.addEventListener('click', function() {
    paymentModal.style.display = 'none';
    resetPaymentForms();
});

// Cerrar modal al hacer clic fuera
paymentModal.addEventListener('click', function(e) {
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
        resetPaymentForms();
    }
});

// Seleccionar método de pago
document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', function() {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
        document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('active'));
        
        this.classList.add('selected');
        const methodType = this.getAttribute('data-method');
        document.getElementById(`form-${methodType}`).classList.add('active');
        
        actualizarMontosPago();
    });
});

// Procesar pagos
document.getElementById('pay-card')?.addEventListener('click', procesarPagoTarjeta);
document.getElementById('pay-paypal')?.addEventListener('click', procesarPagoPayPal);
document.getElementById('confirm-transfer')?.addEventListener('click', procesarTransferencia);
document.getElementById('confirm-cash')?.addEventListener('click', procesarEfectivo);

// FUNCIÓN GLOBAL para actualizar resumen del pedido
window.actualizarResumenPedido = function() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    orderItems.innerHTML = carrito.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            <span>${item.nombre} x${item.cantidad}</span>
            <span>$${item.subtotal.toFixed(2)}</span>
        </div>
    `).join('');
    
    orderTotal.textContent = total.toFixed(2);
}

function actualizarMontosPago() {
    const cardAmount = document.getElementById('card-amount');
    const paypalAmount = document.getElementById('paypal-amount');
    
    if (cardAmount) cardAmount.textContent = total.toFixed(2);
    if (paypalAmount) paypalAmount.textContent = total.toFixed(2);
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
    const cashChange = document.getElementById('cash-change').value;
    if (cashChange && parseFloat(cashChange) < total) {
        mostrarNotificacion('❌ El cambio debe ser mayor al total');
        return;
    }
    
    mostrarNotificacion('💵 Confirmando pago en efectivo...');
    simularProcesoPago('efectivo');
}

function simularProcesoPago(metodo) {
    paymentModal.style.display = 'none';
    resetPaymentForms();
    
    setTimeout(() => {
        mostrarNotificacion('✅ Pago procesado exitosamente');
        
        // Limpiar carrito después del pago exitoso
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
        
    }, 2000);
}

function resetPaymentForms() {
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
    document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('active'));
    
    document.querySelectorAll('.payment-form input').forEach(input => {
        input.value = '';
    });
}

// Generar número de pedido aleatorio
document.getElementById('order-number').textContent = Math.floor(1000 + Math.random() * 9000);