// Quitar importación, usar función global

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;
    const isAdmin = form.isAdmin.checked;

    if (!email || !password) return alert("Completa email y contraseña.");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isAdmin })
      });

      const data = await res.json();
      if (!res.ok) {
        return alert(data.message || "Error al iniciar sesión");
      }

      // Guardar usuario (sin password)
      saveUser(data.user);

      // Redirigir según rol
      if (data.user.isAdmin) {
        window.location.href = "/admin-dashboard.html";
      } else {
        window.location.href = "/dashboard.html";
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor.");
    }
  });
});
