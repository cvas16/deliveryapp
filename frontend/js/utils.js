window.getUser = function() {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user from storage', error);
    return null;
  }
}

window.saveUser = function(user) {
  try {
    if (!user) return;
    // Remove password if present
    const userCopy = { ...user };
    delete userCopy.password;
    localStorage.setItem('user', JSON.stringify(userCopy));
  } catch (error) {
    console.error('Error saving user to storage', error);
  }
}

window.logoutAndRedirect = function() {
  localStorage.removeItem('user');
  window.location.href = 'index.html'; // Changed to index.html as login page
}
