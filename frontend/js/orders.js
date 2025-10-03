// frontend/js/orders.js - Gestión de órdenes del usuario

class OrdersManager {
  constructor() {
    this.orders = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    await this.loadOrders();
    this.setupEventListeners();
    this.renderOrders();
    this.setUserName();
  }

  async loadOrders() {
    const user = window.getUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await fetch(`/api/orders/user?userId=${user.id}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || 'Error al cargar órdenes');
      }
      this.orders = (result.data || []).map(order => ({ ...order, total: parseFloat(order.total) }));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  setupEventListeners() {
    // Remove inline onclick handlers and add event listeners for filter buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
      button.removeAttribute('onclick');
      button.addEventListener('click', () => {
        this.filterOrders(button.getAttribute('data-status'));
      });
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', window.logout);
  }

  filterOrders(status) {
    this.currentFilter = status;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.filter-btn[data-status="${status}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    this.renderOrders();
  }

  setUserName() {
    const user = window.getUser();
    const display = document.getElementById('userNameDisplay');
    if (display && user) {
      display.textContent = user.first_name ? `${user.first_name} ${user.last_name}` : user.email;
    }
  }

  renderOrders() {
    const container = document.getElementById('userOrdersList');
    const emptyContainer = document.getElementById('emptyOrders');
    if (!container || !emptyContainer) return;

    let filteredOrders = this.orders;
    if (this.currentFilter !== 'all') {
      const statusMap = { 'in-progress': 'delivering' };
      const filterStatus = statusMap[this.currentFilter] || this.currentFilter;
      filteredOrders = this.orders.filter(order => order.status === filterStatus);
    }

    if (filteredOrders.length === 0) {
      container.innerHTML = '';
      emptyContainer.style.display = 'block';
      return;
    }

    emptyContainer.style.display = 'none';

    container.innerHTML = filteredOrders.map(order => {
      const statusClass = this.getStatusClass(order.status);
      const statusText = this.getStatusText(order.status);
      const time = this.formatTime(order.created_at);
      const restaurantName = order.restaurant_name || 'Restaurante';
      const restaurantThumb = 'https://images.pexels.com/photos/2762942/pexels-photo-2762942.jpeg?auto=compress&cs=tinysrgb&w=200'; // Placeholder

      let itemsHtml = '';
      let subtotal = '0.00';
      try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        if (Array.isArray(items)) {
          itemsHtml = items.map(item => {
            const subtotal = (item.totalPerUnit * item.quantity).toFixed(2);
            return `
              <div class="order-item">
                <span>${item.quantity}x ${item.productName}</span>
                <span>$${subtotal}</span>
              </div>
            `;
          }).join('');
          subtotal = items.reduce((sum, item) => sum + (item.totalPerUnit * item.quantity), 0).toFixed(2);
        } else {
          itemsHtml = '<div class="order-item">Información de items no disponible</div>';
        }
      } catch (e) {
        itemsHtml = '<div class="order-item">Error al cargar items</div>';
      }

      const delivery = 3.00; // Assume fixed delivery
      const total = order.total.toFixed(2);

      const trackingHtml = this.getTrackingHtml(order.status);

      const actionsHtml = this.getActionsHtml(order.status, order.id);

      return `
        <div class="user-order-card ${statusClass}">
          <div class="order-header">
            <div class="order-basic-info">
              <h3>Pedido #${order.id}</h3>
              <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            <div class="order-time">
              <small>${time}</small>
            </div>
          </div>

          <div class="order-restaurant">
            <img src="${restaurantThumb}" alt="${restaurantName}" class="restaurant-thumb">
            <div class="restaurant-info">
              <h4>${restaurantName}</h4>
              <p>Zona Norte • Pizza</p>
            </div>
          </div>

          <div class="order-items">
            ${itemsHtml}
          </div>

          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>$${subtotal}</span>
            </div>
            <div class="summary-row">
              <span>Domicilio:</span>
              <span>$${delivery.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
              <span><strong>Total:</strong></span>
              <span><strong>$${total}</strong></span>
            </div>
          </div>

          <div class="order-tracking">
            ${trackingHtml}
          </div>

          <div class="order-actions">
            ${actionsHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  showDetails(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    // For simplicity, show alert with details; in full impl, open modal
    let itemsDetails = 'Información no disponible';
    try {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(items)) {
        itemsDetails = items.map(item => `${item.productName} x${item.quantity} - $${(item.totalPerUnit * item.quantity).toFixed(2)}`).join('\n');
      }
    } catch (e) {
      // keep default
    }
    alert(`Pedido #${order.id}\n\nItems:\n${itemsDetails}\n\nTotal: $${parseFloat(order.total).toFixed(2)}\nEstado: ${this.getStatusText(order.status)}`);
  }

  getStatusClass(status) {
    const classes = {
      pending: 'pending',
      preparing: 'preparing',
      delivering: 'delivering',
      delivered: 'delivered',
      cancelled: 'cancelled'
    };
    return classes[status] || 'pending';
  }

  formatTime(createdAt) {
    const date = new Date(createdAt);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
      return `Pedido hoy a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (hours < 48) {
      return 'Ayer';
    } else {
      return `${Math.floor(hours / 24)} días atrás`;
    }
  }

  getTrackingHtml(status) {
    const steps = [
      { name: 'Pedido Confirmado', icon: '✓', completed: true },
      { name: 'Preparando', icon: '✓', completed: ['preparing', 'delivering', 'delivered'].includes(status) },
      { name: 'En Camino', icon: '🚚', completed: ['delivering', 'delivered'].includes(status) },
      { name: 'Entregado', icon: '📍', completed: status === 'delivered' }
    ];

    return steps.map(step => `
      <div class="tracking-step ${step.completed ? 'completed' : ''}">
        <div class="step-icon">${step.icon}</div>
        <div class="step-info">
          <p>${step.name}</p>
          <small>${step.completed ? 'Completado' : ''}</small>
        </div>
      </div>
    `).join('');
  }

  getActionsHtml(status, orderId) {
    if (status === 'pending') {
      return `<button class="btn btn-danger btn-small" onclick="cancelOrder(${orderId})">Cancelar</button>`;
    } else if (status === 'delivered') {
      return `<button class="btn btn-primary btn-small" onclick="orderAgain(${orderId})">Pedir de Nuevo</button><button class="btn btn-secondary btn-small">Calificar</button>`;
    } else if (status === 'cancelled') {
      return `<button class="btn btn-primary btn-small" onclick="orderAgain(${orderId})">Pedir de Nuevo</button>`;
    } else {
      return '<button class="btn btn-secondary btn-small">Rastrear Pedido</button>' + (status === 'preparing' ? `<button class="btn btn-danger btn-small" onclick="cancelOrder(${orderId})">Cancelar</button>` : '');
    }
  }

  getStatusText(status) {
    const texts = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      delivering: 'En Camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };
    return texts[status] || status;
  }
}

// Global functions
window.filterUserOrders = (status) => ordersManager.filterOrders(status);
window.logout = () => {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    localStorage.removeItem('deliveryAppUser');
    window.location.href = 'index.html';
  }
};
window.cancelOrder = async (orderId) => {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });
    if (!response.ok) throw new Error('Failed to cancel order');
    await ordersManager.loadOrders(); // Reload orders
    ordersManager.renderOrders(); // Re-render
  } catch (error) {
    alert('Error cancelling order: ' + error.message);
  }
};
window.orderAgain = (orderId) => {
  const order = ordersManager.orders.find(o => o.id === orderId);
  if (order) {
    window.location.href = `restaurant.html?restaurantId=${order.restaurant_id}`;
  }
};

const ordersManager = new OrdersManager();
window.ordersManager = ordersManager;
