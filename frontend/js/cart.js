// frontend/js/cart.js - Sistema de carrito de compras

class Cart {
  constructor() {
    this.items = this.loadCart();
  }

  // Cargar carrito desde localStorage
  loadCart() {
    const savedCart = localStorage.getItem('deliveryAppCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  // Guardar carrito en localStorage
  saveCart() {
    localStorage.setItem('deliveryAppCart', JSON.stringify(this.items));
  }

  // Agregar producto al carrito with extras support
  addItem(restaurantId, productName, basePrice, quantity = 1, extras = []) {
    const extrasPrice = extras.reduce((sum, extra) => sum + parseFloat(extra.price), 0);
    const totalPerUnit = parseFloat(basePrice) + extrasPrice;
    const itemKey = `${restaurantId}-${productName}`; // For uniqueness if extras differ, but simple for now

    const existingItem = this.items.find(item =>
      item.restaurantId === restaurantId && item.productName === productName
    );

    if (existingItem) {
      // For simplicity, append extras or merge; here assume same extras, just + quantity
      existingItem.quantity += quantity;
      existingItem.extras = [...existingItem.extras, ...extras]; // Append if different
      existingItem.extrasPrice = extrasPrice; // Update if needed
    } else {
      this.items.push({
        restaurantId,
        productName,
        basePrice: parseFloat(basePrice),
        extrasPrice,
        extras,
        totalPerUnit,
        quantity
      });
    }

    this.saveCart();
    this.updateCartUI();
    this.renderCart();
    this.showNotification(`${productName} (${quantity}) agregado al carrito`);
    if (typeof toggleCart === 'function') toggleCart();
  }

  // Remover producto del carrito
  removeItem(restaurantId, productName) {
    this.items = this.items.filter(item =>
      !(item.restaurantId === restaurantId && item.productName === productName)
    );

    this.saveCart();
    this.updateCartUI();
    this.renderCart();
  }

  // Actualizar cantidad de un producto
  updateQuantity(restaurantId, productName, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(restaurantId, productName);
      return;
    }

    const item = this.items.find(item =>
      item.restaurantId === restaurantId && item.productName === productName
    );

    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
      this.updateCartUI();
      this.renderCart(); // Re-render to update subtotals
    }
  }

  // Obtener total del carrito
  getTotal() {
    return this.items.reduce((total, item) => total + (item.totalPerUnit * item.quantity), 0);
  }

  // Obtener número total de items
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Limpiar carrito
  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartUI();
    this.renderCart();
  }

  // Realizar pedido (checkout)
  async checkout() {
    const userStr = localStorage.getItem('deliveryAppUser');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      alert('Debes iniciar sesión para realizar un pedido');
      window.location.href = 'login.html';
      return;
    }

    if (this.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: this.items,
          total: this.getTotal()
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear pedido');
      }

      const result = await response.json();
      this.clearCart();
      this.showNotification('Pedido realizado exitosamente!');
      window.location.href = 'orders.html';
    } catch (error) {
      console.error(error);
      alert('Error al realizar el pedido. Intenta de nuevo.');
    }
  }

  // Mostrar notificación
  showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;

    // Agregar estilos CSS si no existen
    if (!document.getElementById('cart-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'cart-notification-styles';
      styles.textContent = `
        .cart-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #28a745;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
          font-weight: 500;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .cart-notification.removing {
          animation: slideOut 0.3s ease-in;
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
      notification.classList.add('removing');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Actualizar UI del carrito
  updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartCount) {
      cartCount.textContent = this.getTotalItems();
    }

    if (cartTotal) {
      cartTotal.textContent = this.getTotal().toFixed(2);
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = this.getTotalItems() === 0;
    }
  }

  // Renderizar items del carrito
  renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
      return;
    }

    cartItemsContainer.innerHTML = this.items.map(item => {
      const extrasList = item.extras.length > 0 ? item.extras.map(e => `<small>+ ${e.name} ($${e.price})</small>`).join('<br>') : '';
      const subtotal = (item.totalPerUnit * item.quantity).toFixed(2);

      return `
        <div class="cart-item" data-restaurant-id="${item.restaurantId}" data-product-name="${item.productName}">
          <div class="cart-item-info">
            <h4>${item.productName}</h4>
            <p class="item-base-price">Base: $${item.basePrice.toFixed(2)}</p>
            ${extrasList ? `<div class="item-extras">${extrasList}</div>` : ''}
            <span class="item-total">Subtotal: $${subtotal}</span>
          </div>
          <div class="cart-item-controls">
            <button class="quantity-btn minus">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus">+</button>
            <button class="remove-btn">×</button>
          </div>
        </div>
      `;
    }).join('');

    // Add checkout button if not present
    let checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) {
      checkoutBtn = document.createElement('button');
      checkoutBtn.id = 'checkoutBtn';
      checkoutBtn.className = 'checkout-btn';
      checkoutBtn.textContent = 'Realizar Pedido';
      checkoutBtn.addEventListener('click', () => this.checkout());
      cartItemsContainer.parentNode.appendChild(checkoutBtn);
    }

    // Event delegation for cart item buttons
    cartItemsContainer.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('quantity-btn')) {
        const item = target.closest('.cart-item');
        const restaurantId = item.dataset.restaurantId;
        const productName = item.dataset.productName;
        if (target.classList.contains('minus')) {
          this.updateQuantity(restaurantId, productName, parseInt(item.querySelector('.quantity').textContent) - 1);
        } else if (target.classList.contains('plus')) {
          this.updateQuantity(restaurantId, productName, parseInt(item.querySelector('.quantity').textContent) + 1);
        }
      } else if (target.classList.contains('remove-btn')) {
        const item = target.closest('.cart-item');
        const restaurantId = item.dataset.restaurantId;
        const productName = item.dataset.productName;
        this.removeItem(restaurantId, productName);
      }
    });
  }
}

// Crear instancia global del carrito
const cart = new Cart();
window.cart = cart;

// Funciones globales para usar en HTML
function addToCart(restaurantId, productName, price) {
  window.cart.addItem(restaurantId, productName, price);
}

function updateQuantity(restaurantId, productName, quantity) {
  window.cart.updateQuantity(restaurantId, productName, quantity);
}

function removeFromCart(restaurantId, productName) {
  window.cart.removeItem(restaurantId, productName);
}
