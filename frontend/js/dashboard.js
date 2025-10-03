document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  await loadZones();
  await loadRestaurants();

  setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
  // Filtros
  document.getElementById('categoryFilter').addEventListener('change', loadRestaurants);
  document.getElementById('zoneFilter').addEventListener('change', loadRestaurants);

  // Búsqueda
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Header buttons
  const btnInicio = document.getElementById('btnInicio');
  if (btnInicio) {
    btnInicio.addEventListener('click', () => window.location.href = 'dashboard.html');
  }

  const btnPedidos = document.getElementById('btnPedidos');
  if (btnPedidos) {
    btnPedidos.addEventListener('click', () => window.location.href = 'orders.html');
  }

  const btnUsuarioDemo = document.getElementById('btnUsuarioDemo');
  if (btnUsuarioDemo) {
    btnUsuarioDemo.addEventListener('click', () => alert('Funcionalidad de usuario demo próximamente.'));
  }

  // Event delegation for restaurant and product clicks
  const restaurantsContainer = document.getElementById('restaurantsContainer');
  if (restaurantsContainer) {
    restaurantsContainer.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('add-to-cart') || target.closest('.add-to-cart')) {
        e.preventDefault();
        e.stopPropagation();
        const button = target.classList.contains('add-to-cart') ? target : target.closest('.add-to-cart');
        const restaurantId = button.dataset.restaurantId;
        const productId = button.dataset.productId;
        const name = button.dataset.name;
        const description = button.dataset.description;
        const price = parseFloat(button.dataset.price);
        // Fix: openModal call was incomplete or malformed in previous code
        openModal(restaurantId, productId, name, description, price);
        return; // Prevent further event handling
      } else if (target.closest('.restaurant-card')) {
        const restaurantCard = target.closest('.restaurant-card');
        const restaurantId = restaurantCard.dataset.restaurantId;
        viewRestaurant(restaurantId);
      } else if (target.closest('.product-result')) {
        const productResult = target.closest('.product-result');
        const restaurantId = productResult.dataset.restaurantId;
        viewRestaurant(restaurantId);
      }
    });
  }

  // Modal and cart event listeners
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.querySelector('.modal-footer .btn-secondary').addEventListener('click', closeModal);

  document.querySelector('.close-cart').addEventListener('click', toggleCart);
  document.querySelector('.cart-toggle').addEventListener('click', toggleCart);
  document.getElementById('checkoutBtn').addEventListener('click', checkout);

  // Initial cart render
  window.cart.renderCart();
  window.cart.updateCartUI();
}

// Cargar categorías en el select
async function loadCategories() {
  try {
    const response = await fetch('/api/restaurants/meta/categories');
    const result = await response.json();

    if (result.success) {
      const select = document.getElementById('categoryFilter');
      select.innerHTML = '<option value="all">Todas las categorías</option>';

      result.data.forEach(category => {
        select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
      });
    }
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
}

// Cargar zonas en el select
async function loadZones() {
  try {
    const response = await fetch('/api/restaurants/meta/zones');
    const result = await response.json();

    if (result.success) {
      const select = document.getElementById('zoneFilter');
      select.innerHTML = '<option value="all">Todas las ubicaciones</option>';

      result.data.forEach(zone => {
        select.innerHTML += `<option value="${zone.id}">${zone.name}</option>`;
      });
    }
  } catch (error) {
    console.error('Error cargando zonas:', error);
  }
}

// Cargar restaurantes
async function loadRestaurants() {
  try {
    const category = document.getElementById('categoryFilter').value;
    const zone = document.getElementById('zoneFilter').value;
    const search = document.getElementById('searchInput').value;

    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (zone !== 'all') params.append('zone', zone);
    if (search) params.append('search', search);

    const response = await fetch(`/api/restaurants?${params}`);
    const result = await response.json();

    if (result.success) {
      await renderRestaurants(result.data);
    }
  } catch (error) {
    console.error('Error cargando restaurantes:', error);
  }
}

// Manejar búsqueda
async function handleSearch() {
  const searchTerm = document.getElementById('searchInput').value.trim();

  if (!searchTerm) {
    loadRestaurants();
    return;
  }

  try {
    const response = await fetch(`/api/restaurants/search/${encodeURIComponent(searchTerm)}`);
    const result = await response.json();

    if (result.success) {
      await renderSearchResults(result.data);
    }
  } catch (error) {
    console.error('Error en búsqueda:', error);
  }
}

// Renderizar restaurantes
async function renderRestaurants(restaurants) {
  const container = document.getElementById('restaurantsContainer');

  if (!container) {
    console.error('Container de restaurantes no encontrado');
    return;
  }

  if (restaurants.length === 0) {
    container.innerHTML = '<div class="loading">No se encontraron restaurantes.</div>';
    return;
  }

  // Crear HTML para cada restaurante
  const restaurantsHTML = await Promise.all(restaurants.map(async (restaurant) => {
    const productsHTML = await renderRestaurantProducts(restaurant.id);

    return `
      <div class="restaurant-card" data-restaurant-id="${restaurant.id}">
        <div class="restaurant-header">
          <div class="restaurant-image">
            <img src="${restaurant.image_url || '/images/default-restaurant.jpg'}" alt="${restaurant.name}"
                 onerror="this.src='/images/placeholder.jpg'">
            <div class="rating">⭐ ${restaurant.rating}</div>
          </div>
          <div class="restaurant-info">
            <h3>${restaurant.name}</h3>
            <p class="category">${restaurant.category_name || 'Restaurante'}</p>
            <div class="restaurant-details">
              <span class="delivery-time">${restaurant.delivery_time_min}-${restaurant.delivery_time_max} min</span>
              <span class="delivery-fee">$${parseFloat(restaurant.delivery_fee).toFixed(2)}</span>
              <span class="zone">${restaurant.zone_name || 'Zona centro'}</span>
            </div>
          </div>
        </div>
        <div class="restaurant-products">
          ${productsHTML}
        </div>
      </div>
    `;
  }));

  container.innerHTML = restaurantsHTML.join('');
}

// Renderizar productos de un restaurante desde la API (solo 3 productos principales)
async function renderRestaurantProducts(restaurantId) {
  try {
    const response = await fetch(`/api/restaurants/${restaurantId}/products`);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      // Obtener todos los productos y tomar solo los primeros 3
      const allProducts = result.data.flatMap(category => category.products);
      const topProducts = allProducts.slice(0, 3);

      return topProducts.map(product => `
        <div class="product-item">
          <div class="product-info">
            <h4>${product.name}</h4>
            <p class="product-description">${product.description}</p>
          </div>
          <div class="product-actions">
            <span class="price">$${product.price}</span>
            <button type="button" class="add-to-cart" data-restaurant-id="${restaurantId}" data-product-id="${product.id}" data-name="${product.name.replace(/"/g, '"')}" data-description="${product.description.replace(/"/g, '"')}" data-price="${product.price}">
              Agregar al Carrito
            </button>
          </div>
        </div>
      `).join('');
    } else {
      return '<div class="loading-products">No hay productos disponibles</div>';
    }
  } catch (error) {
    console.error('Error cargando productos:', error);
    return '<div class="loading-products">Error cargando productos</div>';
  }
}

// Renderizar resultados de búsqueda
async function renderSearchResults(data) {
  const container = document.getElementById('restaurantsContainer');

  let html = '';

  if (data.restaurants.length > 0) {
    // Renderizar restaurantes con productos
    const restaurantsHTML = await Promise.all(data.restaurants.map(async (restaurant) => {
      const productsHTML = await renderRestaurantProducts(restaurant.id);
      return `
        <div class="restaurant-card" data-restaurant-id="${restaurant.id}">
          <div class="restaurant-header">
            <div class="restaurant-image">
            <img src="${restaurant.image_url || '/images/default-restaurant.jpg'}" alt="${restaurant.name}"
                 onerror="this.src='/images/placeholder.jpg'">
            <div class="rating">⭐ ${restaurant.rating}</div>
          </div>
          <div class="restaurant-info">
            <h3>${restaurant.name}</h3>
            <p class="category">${restaurant.category_name || 'Restaurante'}</p>
            <div class="restaurant-details">
              <span class="delivery-time">${restaurant.delivery_time_min}-${restaurant.delivery_time_max} min</span>
              <span class="delivery-fee">$${parseFloat(restaurant.delivery_fee).toFixed(2)}</span>
              <span class="zone">${restaurant.zone_name || 'Zona centro'}</span>
            </div>
          </div>
        </div>
        <div class="restaurant-products">
          ${productsHTML}
        </div>
      </div>
      `;
    }));
    html += restaurantsHTML.join('');
  }

  if (data.products.length > 0) {
    html += data.products.map(product => `
      <div class="product-result" data-restaurant-id="${product.restaurant_id}">
        <h4>${product.name}</h4>
        <p>En: ${product.restaurant_name}</p>
        <span class="price">$${product.price}</span>
      </div>
    `).join('');
  }

  container.innerHTML = html || '<p>No se encontraron resultados.</p>';
}

// Ver restaurante específico
function viewRestaurant(restaurantId) {
  window.location.href = `restaurant.html?restaurantId=${restaurantId}`;
}

// Open product modal
let currentProductData = {};
function openModal(restaurantId, productId, name, description, basePrice) {
  currentProductData = { restaurantId, productId, name, description, basePrice };
  document.getElementById('modalProductName').textContent = name;
  document.getElementById('modalProductDescription').textContent = description;
  document.getElementById('modalQuantity').value = 1;
  document.getElementById('modalTotal').textContent = basePrice.toFixed(2);

  // Hardcoded extras (customize per product if needed)
  const extras = [
    { name: 'Extra cheese', price: 2.00 },
    { name: 'Tamaño Pequeño', price: 0.00 },
    { name: 'Tamaño Familiar', price: 5.00 }
  ];
  const extrasContainer = document.getElementById('modalExtras');
  extrasContainer.innerHTML = extras.map(extra => `
    <label class="extra-checkbox">
      <input type="checkbox" value="${extra.price}" data-name="${extra.name}">
      ${extra.name} (+$${extra.price.toFixed(2)})
    </label>
  `).join('');

  // Add event listener for extras
  extrasContainer.addEventListener('change', updateModalTotal);

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Attach event listeners to modal buttons after modal is opened
  const modal = document.getElementById('productModal');
  const btnAddToCart = modal.querySelector('.modal-footer .btn-primary');
  const btnCancel = modal.querySelector('.modal-footer .btn-secondary');
  btnAddToCart.onclick = addFromModal;
  btnCancel.onclick = closeModal;
}

// Close modal
function closeModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = 'auto';
}

// Update modal total
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

// Add from modal
function addFromModal() {
  const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
  const selectedExtras = Array.from(document.querySelectorAll('#modalExtras input:checked')).map(cb => ({
    name: cb.dataset.name,
    price: parseFloat(cb.value)
  }));
  window.cart.addItem(currentProductData.restaurantId, currentProductData.name, currentProductData.basePrice, quantity, selectedExtras);
  closeModal();
}

// Checkout
function checkout() {
  if (window.cart.getTotalItems() === 0) return;
  const total = window.cart.getTotal();
  alert(`¡Pedido realizado con éxito! Total: $${total.toFixed(2)}`);
  window.cart.clearCart();
  toggleCart(); // Close sidebar
}

// Toggle cart sidebar
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  sidebar.classList.toggle('open');
  // Add overlay if needed
  if (sidebar.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

// Logout function
function logout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    localStorage.removeItem('deliveryAppUser');
    window.location.href = 'index.html';
  }
}
