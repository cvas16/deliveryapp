// frontend/js/register.js
// Versión simplificada sin dependencias de utils

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    // Validaciones
    if (!firstName || !lastName || !email || !password) {
      return showAlert("Completa los campos obligatorios.", 'error');
    }

    if (!validateEmail(email)) {
      return showAlert("Por favor ingresa un email válido.", 'error');
    }

    if (password.length < 6) {
      return showAlert("La contraseña debe tener al menos 6 caracteres.", 'error');
    }

    if (password !== confirm) {
      return showAlert("Las contraseñas no coinciden.", 'error');
    }

    // Validar términos si existe
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
      return showAlert("Debes aceptar los términos y condiciones.", 'error');
    }

    // Cambiar botón a estado de carga
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creando cuenta...';
    submitBtn.disabled = true;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, address, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        showAlert(data.message || data.error || "Error al registrar", 'error');
        return;
      }

      showAlert("¡Usuario registrado correctamente! Redirigiendo...", 'success');
      
      // Limpiar formulario
      form.reset();
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);

    } catch (err) {
      console.error('Error:', err);
      showAlert("Error de conexión con el servidor.", 'error');
    } finally {
      // Restaurar botón
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});

// Funciones de utilidad locales
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showAlert(message, type = 'info') {
  // Remover alerta anterior si existe
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Crear nueva alerta
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  // Insertar al inicio del formulario
  const form = document.getElementById('registerForm');
  form.insertBefore(alert, form.firstChild);
  
  // Auto-remover después de 5 segundos (excepto success que se mantiene)
  if (type !== 'success') {
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }
}