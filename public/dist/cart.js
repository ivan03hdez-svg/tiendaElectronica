let carrito = [];
export function agregarAlCarrito(producto, cantidad = 1) {
    const itemExistente = carrito.find((item) => item.producto.id === producto.id);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    }
    else {
        carrito.push({ producto, cantidad });
    }
    guardarCarrito();
    window.dispatchEvent(new CustomEvent('carrito:change'));
}
export function eliminarDelCarrito(productoId) {
    carrito = carrito.filter((item) => item.producto.id !== productoId);
    guardarCarrito();
    window.dispatchEvent(new CustomEvent('carrito:change'));
}
export function actualizarCantidad(productoId, nuevaCantidad) {
    const item = carrito.find((i) => i.producto.id === productoId);
    if (item) {
        item.cantidad = nuevaCantidad > 0 ? nuevaCantidad : 1;
        guardarCarrito();
        window.dispatchEvent(new CustomEvent('carrito:change'));
    }
}
export function calcularTotal(carritoActual = carrito) {
    return carritoActual.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
}
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
export function cargarCarrito() {
    const data = localStorage.getItem("carrito");
    carrito = data ? JSON.parse(data) : [];
    return carrito;
}
