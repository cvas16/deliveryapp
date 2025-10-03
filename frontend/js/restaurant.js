// frontend/js/restaurant.js
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantId = urlParams.get('restaurantId');
  if (restaurantId) {
    await loadRestaurant(restaurantId);
  }
  setupEventListeners();
});

function setupEventListeners() {
  // Search and filters (similar to dashboard)
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => window.location.href = `dashboard.html?search=${encodeURIComponent(searchInput.value)}`);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        window.location.href = `dashboard.html?search=${encodeURIComponent(searchInput.value)}`;
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Initial cart render
  window.cart.renderCart();
  window.cart.updateCartUI();
}

async function loadRestaurant(id) {
  try {
    const response = await fetch(`/api/restaurants/${id}`);
    const result = await response.json();

    if (result.success) {
      const data = result.data;
      const restaurant = data.restaurant;
      const categories = data.categories;

      // Render header
      document.getElementById('restaurantHeader').innerHTML = `
        <img src="${restaurant.image_url || '/images/default-restaurant.jpg'}" alt="${restaurant.name}" onerror="this.src='/images/placeholder.jpg'">
        <h1>${restaurant.name}</h1>
        <p>${restaurant.category_name} • ${restaurant.zone_name}</p>
        <div>⭐ ${restaurant.rating} • ${restaurant.delivery_time_min}-${restaurant.delivery_time_max} min • $${restaurant.delivery_fee}</div>
        <p>${restaurant.description}</p>
      `;

      // Render products by category
      const container = document.getElementById('productsContainer');
      let html = '';
      categories.forEach(category => {
        if (category.products.length > 0) {
          html += `<div class="category-section"><h2 class="category-title">${category.name}</h2>`;
          category.products.forEach(product => {
            html += `
              <div class="product-item">
                <div class="product-info">
                  <h4>${product.name}</h4>
                  <p class="product-description">${product.description}</p>
                </div>
                <div class="product-actions">
                  <span class="price">$${product.price}</span>
                  <button type="button" class="add-to-cart" onclick="openModal(${id}, ${product.id}, '${product.name.replace(/'/g, "\\'")}', '${product.description.replace(/'/g, "\\'")}', ${product.price})">
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            `;
          });
          html += '</div>';
        }
      });
      container.innerHTML = html || '<p>No hay productos disponibles.</p>';
    } else {
      document.getElementById('productsContainer').innerHTML = '<p>Restaurante no encontrado.</p>';
    }
  } catch (error) {
    console.error('Error cargando restaurante:', error);
    document.getElementById('productsContainer').innerHTML = '<p>Error al cargar el restaurante.</p>';
  }
}

// Modal functions (same as dashboard)
let currentProductData = {};
function openModal(restaurantId, productId, name, description, basePrice) {
  currentProductData = { restaurantId, productId, name, description, basePrice };
  document.getElementById('modalProductName').textContent = name;
  document.getElementById('modalProductDescription').textContent = description;
  document.getElementById('modalQuantity').value = 1;
  document.getElementById('modalTotal').textContent = basePrice.toFixed(2);

  // Hardcoded extras
  const extras = [
    { name: 'Extra cheese', price: 2.00 },
    { name: 'Tamaño Pequeño', price: 0.00 },
    { name: 'Tamaño Familiar', price: 5.00 }
  ];
  const extrasContainer = document.getElementById('modalExtras');
  extrasContainer.innerHTML = extras.map(extra => `
    <label class="extra-checkbox">
      <input type="checkbox" value="${extra.price}" onchange="updateModalTotal()" data-name="${extra.name}">
      ${extra.name} (+$${extra.price.toFixed(2)})
    </label>
  `).join('');

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  updateModalTotal();
}

function closeModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = 'auto';
}
// actualiza el total en el modal
function updateModalTotal() {
  const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
  const basePrice = currentProductData.basePrice;
  const selectedExtras = Array.from(document.querySelectorAll('#modalExtras input:checked')).map(cb => ({
    name: cb.dataset.name,
    price: parseFloat(cb.value)
  }));
  const extrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const total = (basePrice + extrasPrice) * quantity;
  document.getElementById('modalTotal').textContent = total.toFixed(2);
}
// agrega el producto al carrito desde el modal
function addFromModal() {
  const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
  const selectedExtras = Array.from(document.querySelectorAll('#modalExtras input:checked')).map(cb => ({
    name: cb.dataset.name,
    price: parseFloat(cb.value)
  }));
  window.cart.addItem(currentProductData.restaurantId, currentProductData.name, currentProductData.basePrice, quantity, selectedExtras);
  closeModal();
}

// Cart functions (same as dashboard)
function checkout() {
  if (window.cart.getTotalItems() === 0) return;
  const total = window.cart.getTotal();
  alert(`¡Pedido realizado con éxito! Total: $${total.toFixed(2)}`);
  window.cart.clearCart();
  toggleCart();
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  sidebar.classList.toggle('open');
  if (sidebar.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

function logout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
}

window.openModal = openModal;
