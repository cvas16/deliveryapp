// frontend/js/main.js
import { getUser, logoutAndRedirect } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user) return logoutAndRedirect();

  const welcome = document.getElementById("welcome");
  if (welcome) welcome.textContent = `Bienvenido, ${user.firstName} ${user.lastName}`;

  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    logoutAndRedirect();
  });
});
