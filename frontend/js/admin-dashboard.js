document.addEventListener('DOMContentLoaded', () => {
  // Sidebar navigation logic
  const sidebarItems = document.querySelectorAll('.sidebar-menu li');
  const tabContents = document.querySelectorAll('.tab-content');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all sidebar items and tab contents
      sidebarItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      // Add active class to clicked sidebar item and corresponding content
      item.classList.add('active');
      const target = item.getAttribute('data-tab');
      const targetElement = document.getElementById(target);
      targetElement.classList.add('active');

      // Scroll the target element to top instead of window
      targetElement.scrollTop = 0;
    });
  });

  // Load dashboard stats on initial load
  loadDashboardStats();
  loadDeliveryPersons();
  // Cargar pedidos al iniciar
  loadOrders();
  // Filtros de pedidos
  document.querySelectorAll('.order-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadOrders(btn.classList.contains('all') ? null : btn.textContent.trim().toUpperCase());
    });
  });
});

// Cargar y renderizar pedidos en el panel admin
async function loadOrders(status = null) {
  try {
    const url = status ? `/api/orders/admin?status=${status}` : '/api/orders/admin';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener pedidos');
    const orders = await response.json();
    const container = document.getElementById('orderList');
    container.innerHTML = '';
    if (!orders || orders.length === 0) {
      container.innerHTML = '<p>No hay pedidos para mostrar.</p>';
      return;
    }
    orders.forEach(order => {
      const card = document.createElement('div');
      card.className = `order-card ${order.status?.toLowerCase() || ''}`;
      card.innerHTML = `
        <h3>#${order.id} <span class="status-label ${order.status?.toLowerCase()}">${order.status?.toUpperCase() || ''}</span></h3>
        <p><strong>Cliente:</strong> ${order.user_name || order.user_id}</p>
        <p><strong>Restaurante:</strong> ${order.restaurant_name || order.restaurant_id}</p>
        <p><strong>Dirección:</strong> ${order.address || 'N/A'}</p>
        <p><strong>Total:</strong> $${order.total}</p>
        <p><strong>Hora:</strong> ${order.created_at ? new Date(order.created_at).toLocaleTimeString() : ''}</p>
        ${order.status === 'PENDIENTE' ? `<button class="btn confirm" data-id="${order.id}">Confirmar</button><button class="btn cancel" data-id="${order.id}">Cancelar</button>` : ''}
        ${order.status === 'PREPARANDO' ? `<button class="btn send" data-id="${order.id}">Enviar</button><button class="btn assign" data-id="${order.id}">Asignar Repartidor</button>` : ''}
      `;
      container.appendChild(card);
    });
    // Acciones de botones
    container.querySelectorAll('.btn.confirm').forEach(btn => {
      btn.addEventListener('click', async () => {
        await updateOrderStatus(btn.getAttribute('data-id'), 'PREPARANDO');
        loadOrders(status);
      });
    });
    container.querySelectorAll('.btn.cancel').forEach(btn => {
      btn.addEventListener('click', async () => {
        await updateOrderStatus(btn.getAttribute('data-id'), 'CANCELADO');
        loadOrders(status);
      });
    });
    container.querySelectorAll('.btn.send').forEach(btn => {
      btn.addEventListener('click', async () => {
        await updateOrderStatus(btn.getAttribute('data-id'), 'EN CAMINO');
        loadOrders(status);
      });
    });
    // Puedes agregar lógica para asignar repartidor aquí
  } catch (error) {
    console.error('Error cargando pedidos:', error);
    document.getElementById('orderList').innerHTML = '<p>Error al cargar pedidos.</p>';
  }
}

// Actualizar estado de pedido
async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!response.ok) throw new Error('Error al actualizar estado');
  } catch (error) {
    alert('Error al actualizar estado del pedido');
  }
}

  // Logout button
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    }
  });

  // Add delivery person button
  document.getElementById('addDeliveryBtn')?.addEventListener('click', () => {
    openModal();
  });

  // Add delivery form submission
  document.getElementById('addDeliveryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/delivery-persons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to add delivery person');
      closeModal();
      loadDeliveryPersons(); // Reload the list
    } catch (error) {
      console.error('Error adding delivery person:', error);
      alert('Error adding delivery person');
    }
  });

  // Cancel button in modal
  document.querySelector('#addDeliveryForm button[type="button"]')?.addEventListener('click', () => {
    closeModal();
  });

  // Close modal when clicking outside modal content
  document.getElementById('addDeliveryModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'addDeliveryModal') {
      closeModal();
    }
  });


async function loadDashboardStats() {
  try {
    const response = await fetch('/api/admin/stats');
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();

    document.getElementById('totalOrders').textContent = data.totalOrders;
    document.getElementById('totalUsers').textContent = data.totalUsers;
    // Obtener repartidores disponibles en tiempo real
    const availableResponse = await fetch('/api/delivery-persons?available=1');
    let available = 0;
    if (availableResponse.ok) {
      const arr = await availableResponse.json();
      console.log('API /api/delivery-persons?available=1 response:', arr);
      available = Array.isArray(arr) ? arr.length : (arr.data ? arr.data.length : 0);
    }
    document.getElementById('availableDelivery').textContent = available;
    document.getElementById('avgTime').textContent = data.avgTime || '18 min';

    initBarChart(data.ordersPerHour);
    initPieChart(data.topCategories);
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

function initBarChart(ordersPerHour) {
  const ctx = document.getElementById('barChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        label: 'Pedidos',
        data: ordersPerHour,
        backgroundColor: '#ff6b35',
        borderColor: '#e55a2b',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#555' },
          grid: { color: '#eee' }
        },
        x: {
          ticks: { color: '#555' },
          grid: { color: '#eee' }
        }
      },
      plugins: {
        legend: { labels: { color: '#555' } }
      }
    }
  });
}

function renderTopCategories(topCategories) {
  const container = document.getElementById('topCategories');
  container.innerHTML = '';
  topCategories.forEach(cat => {
    const bar = document.createElement('div');
    bar.className = 'category-bar';

    const label = document.createElement('div');
    label.className = 'category-label';
    label.textContent = cat.category;

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressFill.style.width = `${cat.count}%`;

    const percent = document.createElement('div');
    percent.className = 'progress-percent';
    percent.textContent = `${cat.count}%`;

    progressBar.appendChild(progressFill);
    bar.appendChild(label);
    bar.appendChild(progressBar);
    bar.appendChild(percent);

    container.appendChild(bar);
  });
}

function initPieChart(topCategories) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  const labels = topCategories.map(c => c.category);
  const data = topCategories.map(c => c.count);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#ff6b35', '#e55a2b', '#cc5125', '#b3471f', '#9a3d19']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#333' } }
      }
    }
  });
}

async function loadDeliveryPersons() {
  try {
    const response = await fetch('/api/delivery-persons');
    if (!response.ok) throw new Error('Failed to fetch delivery persons');
    const deliveryPersons = await response.json();

    const container = document.getElementById('deliveryList');
    container.innerHTML = '';

    deliveryPersons.forEach(person => {
      const card = document.createElement('div');
      card.className = `delivery-card ${person.status}`;

      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      if (person.avatar_url) {
        const img = document.createElement('img');
        img.src = person.avatar_url;
        img.alt = person.full_name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        avatar.appendChild(img);
      } else {
        // Generate avatar using UI Avatars service
        const img = document.createElement('img');
        img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.full_name)}&size=128&background=random&color=fff`;
        img.alt = person.full_name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        avatar.appendChild(img);
      }

      const name = document.createElement('h3');
      name.textContent = person.full_name;

      const phone = document.createElement('p');
      phone.textContent = `Teléfono: ${person.phone}`;

      const vehicle = document.createElement('p');
      vehicle.textContent = `Vehículo: ${person.vehicle_type}`;

      const status = document.createElement('p');
      status.textContent = `Estado: ${person.status}`;

      card.appendChild(avatar);
      card.appendChild(name);
      card.appendChild(phone);
      card.appendChild(vehicle);
      card.appendChild(status);

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading delivery persons:', error);
  }
}

function openModal() {
  document.getElementById('addDeliveryModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('addDeliveryModal').classList.remove('open');
  document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('#addDeliveryModal .modal-header button');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  // Load restaurants for management section
  loadRestaurants();

  // Modal para agregar/editar restaurante
  const addRestaurantBtn = document.getElementById('addRestaurantBtn');
  if (addRestaurantBtn) {
    addRestaurantBtn.addEventListener('click', () => {
      openRestaurantModal();
    });
  }

  // Evento para cerrar el modal restaurante
  document.getElementById('restaurantModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'restaurantModal') closeRestaurantModal();
  });

  // Evento para cancelar desde el botón
  document.getElementById('restaurantFormCancel')?.addEventListener('click', () => {
    closeRestaurantModal();
  });

  // Evento para submit del formulario
  document.getElementById('restaurantForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    let method = 'POST';
    let url = '/api/restaurants';
    if (data.id) {
      method = 'PUT';
      url = `/api/restaurants/${data.id}`;
    }
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Error al guardar restaurante');
      closeRestaurantModal();
      loadRestaurants();
    } catch (error) {
      alert('Error al guardar restaurante');
    }
  });
});

async function loadRestaurants() {
  try {
    const response = await fetch('/api/restaurants');
    if (!response.ok) throw new Error('Failed to fetch restaurants');
    const result = await response.json();
    if (!result.success) throw new Error('Failed to fetch restaurants');

    const restaurants = result.data;
    const tbody = document.querySelector('#restaurants table.data-table tbody');
    tbody.innerHTML = '';

    restaurants.forEach(r => {
      const tr = document.createElement('tr');

      const statusClass = r.is_active ? 'active' : 'inactive';
      const statusText = r.is_active ? 'ACTIVO' : 'INACTIVO';
      const rating = r.rating && typeof r.rating === 'number' ? r.rating.toFixed(1) : 'N/A';
      const imageUrl = r.image_url || '/images/placeholder.jpg';
      tr.innerHTML = `
        <td><img src="${imageUrl}" alt="${r.name}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;" onerror="this.src='/images/placeholder.jpg'" /></td>
        <td>${r.name}</td>
        <td>${r.category_name || ''}</td>
        <td>${r.zone_name || ''}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td>${rating} <span class="star">⭐</span></td>
        <td>
          <button class="btn edit" data-id="${r.id}">Editar</button>
          ${r.is_active ?
            `<button class="btn deactivate" data-id="${r.id}">Desactivar</button>` :
            `<button class="btn activate" data-id="${r.id}">Activar</button>`
          }
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Add event listeners for edit, activate, deactivate buttons
    tbody.querySelectorAll('button.edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const restaurant = restaurants.find(r => r.id == id);
        openRestaurantModal(restaurant);
      });
    });
// Modal para agregar/editar restaurante
window.openRestaurantModal = function(restaurant = null) {
  const modal = document.getElementById('restaurantModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Limpiar el formulario
  const form = document.getElementById('restaurantForm');
  form.reset();
  form.id.value = restaurant?.id || '';
  form.name.value = restaurant?.name || '';
  form.category_id.value = restaurant?.category_id || '';
  form.zone_id.value = restaurant?.zone_id || '';
  form.image_url.value = restaurant?.image_url || '';
  form.description.value = restaurant?.description || '';
  form.rating.value = restaurant?.rating || '';
}

window.closeRestaurantModal = function() {
  document.getElementById('restaurantModal').classList.remove('open');
  document.body.style.overflow = 'auto';
}

    tbody.querySelectorAll('button.deactivate').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await updateRestaurantStatus(id, false);
      });
    });

    tbody.querySelectorAll('button.activate').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await updateRestaurantStatus(id, true);
      });
    });

  } catch (error) {
    console.error('Error loading restaurants:', error);
  }
}

async function updateRestaurantStatus(id, isActive) {
  try {
    const response = await fetch(`/api/restaurants/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: isActive })
    });
    if (!response.ok) throw new Error('Failed to update restaurant status');
    await loadRestaurants();
  } catch (error) {
    console.error('Error updating restaurant status:', error);
    alert('Error actualizando estado del restaurante');
  }
}

