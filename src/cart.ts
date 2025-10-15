import { Producto, Carrito } from "./models.js";

let carrito: Carrito[] = [];
export function agregarAlCarrito(producto: Producto, cantidad: number = 1): void {
  const itemExistente = carrito.find((item) => item.producto.id === producto.id);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({ producto, cantidad });
  }

  guardarCarrito();
  window.dispatchEvent(new CustomEvent('carrito:change'));
}

export function eliminarDelCarrito(productoId: number): void {
  carrito = carrito.filter((item) => item.producto.id !== productoId);
  guardarCarrito();
  window.dispatchEvent(new CustomEvent('carrito:change'));
}

export function actualizarCantidad(productoId: number, nuevaCantidad: number): void {
  const item = carrito.find((i) => i.producto.id === productoId);
  if (item) {
    item.cantidad = nuevaCantidad > 0 ? nuevaCantidad : 1;
    guardarCarrito();
    window.dispatchEvent(new CustomEvent('carrito:change'));
  }
}

export function calcularTotal(carritoActual: Carrito[] = carrito): number {
  return carritoActual.reduce(
    (total, item) => total + item.producto.precio * item.cantidad,
    0
  );
}

function guardarCarrito(): void {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function cargarCarrito(): Carrito[] {
  const data = localStorage.getItem("carrito");
  carrito = data ? JSON.parse(data) : [];
  return carrito;
}