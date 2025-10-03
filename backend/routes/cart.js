// Este archivo maneja las operaciones relacionadas con el carrito de compras, incluyendo agregar, eliminar y listar productos en el carrito.

const cart = [];

// Agregar un producto al carrito
function addToCart(product) {
    cart.push(product);
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
}

// Listar todos los productos en el carrito
function listCart() {
    return cart;
}

// Exportar las funciones para su uso en otros módulos
module.exports = {
    addToCart,
    removeFromCart,
    listCart
};