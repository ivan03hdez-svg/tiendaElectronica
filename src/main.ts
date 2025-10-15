import { cargaCatalogo } from './api.js';
import { agregarAlCarrito, cargarCarrito, calcularTotal, eliminarDelCarrito, actualizarCantidad } from './cart.js';
import { getUsuarioActual, login, logout, registrarUsuario, initUsuarios } from './auth.js';
import { Producto } from './models.js';

async function renderCatalogo() {
  const contenedor = document.getElementById('catalogo');
  if (!contenedor) {
    console.error('Elemento #catalogo no encontrado');
    return;
  }

  const productos = await cargaCatalogo();
  contenedor.innerHTML = productos
    .map(
      (p: Producto) => `
    <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
      <img src="${p.imagen || 'img/default.jpg'}" alt="${p.nombre}" class="w-full h-40 object-cover rounded-md mb-2" />
      <h3 class="font-semibold text-lg">${p.nombre}</h3>
      <p class="text-sm text-gray-500">${p.descripcion}</p>
      <p class="text-blue-600 font-bold mt-2">$${p.precio.toFixed(2)}</p>
      <button data-id="${p.id}" class="btn-agregar mt-3 bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700">Agregar al carrito</button>
    </div>`
    )
    .join('');

  contenedor.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number((e.target as HTMLButtonElement).dataset.id);
      const producto = productos.find(p => p.id === id);
      if (producto) agregarAlCarrito(producto);
    });
  });
}

function renderCarrito() {
  const carrito = cargarCarrito();
  const lista = document.getElementById('lista_carrito');
  const totalSpan = document.getElementById('total')!;

  if (!lista) {
    console.error('Elemento #lista_carrito no encontrado');
    return;
  }

  if (carrito.length === 0) {
    lista.innerHTML = `<li class="text-gray-500 text-sm text-center py-4">Tu carrito está vacío</li>`;
    totalSpan.textContent = '$0.00';
    return;
  }

  lista.innerHTML = carrito
    .map(
      i => `
      <li class="flex justify-between items-center py-2">
        <div class="flex items-center gap-2">
          <img src="${i.producto.imagen || 'img/default.jpg'}" alt="${i.producto.nombre}" class="w-12 h-12 object-cover rounded">
          <span>${i.producto.nombre}</span>
        </div>
        <div class="flex items-center gap-2">
          <input type="number" min="1" value="${i.cantidad}" class="w-16 text-center border rounded cantidad-input">
          <span class="font-semibold">$${(i.producto.precio * i.cantidad).toFixed(2)}</span>
          <button class="text-red-600 hover:text-red-800 eliminar-btn" data-id="${i.producto.id}">🗑</button>
        </div>
      </li>`
    )
    .join('');

  totalSpan.textContent = '$' + calcularTotal(carrito).toFixed(2);

  lista.querySelectorAll('.cantidad-input').forEach(input => {
  input.addEventListener('change', e => {
    const targetInput = e.target as HTMLInputElement;
    const li = targetInput.closest('li');
    const btnEliminar = li?.querySelector('.eliminar-btn') as HTMLElement | null;
    const id = btnEliminar ? Number(btnEliminar.dataset.id) : 0;
    const nuevaCantidad = parseInt(targetInput.value);
    if (id > 0 && !isNaN(nuevaCantidad)) {
      actualizarCantidad(id, nuevaCantidad);
    }
  });
});

  lista.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number((e.target as HTMLButtonElement).dataset.id);
      eliminarDelCarrito(id);
    });
  });
}

// Autenticación
function setupAuth() {
  const btnLogin = document.getElementById('btn_login');
  const btnLogout = document.getElementById('btn_logout');
  const modal = document.getElementById('modal_auth');
  const form = document.getElementById('auth_form') as HTMLFormElement;
  const linkReg = document.getElementById('link_registro');
  const btnClose = document.getElementById('btn-cerrar-modal');
  const userStatus = document.getElementById('status_usuario');
  const btnComprar = document.getElementById('btn-comprar')! as HTMLButtonElement;

  if (!btnLogin || !btnLogout || !modal || !form || !linkReg || !userStatus || !btnComprar) {
    console.error('Elementos de auth no encontrados');
    return;
  }
  const closeBtn = btnClose || modal.querySelector('button:last-child');
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.add('hidden');
  }

  let modoRegistro = false;

  function actualizarUIUsuario() {
    const user = getUsuarioActual();
    if (user) {
      if (userStatus) userStatus.textContent = `Sesión: ${user.correo}`;
      btnLogin!.classList.add('hidden');
      btnLogout!.classList.remove('hidden');
      btnComprar.disabled = false;
    } else {
      if (userStatus) userStatus.textContent = 'No has iniciado sesión';
      btnLogin!.classList.remove('hidden');
      btnLogout!.classList.add('hidden');
      btnComprar.disabled = true;
    }
  }

  btnLogin.onclick = () => modal.classList.remove('hidden');
  btnLogout.onclick = () => {
    logout();
    actualizarUIUsuario();
  };

  linkReg.onclick = e => {
    e.preventDefault();
    modoRegistro = !modoRegistro;
    const titleEl = document.getElementById('auth_title');
    if (titleEl) {
      titleEl.textContent = modoRegistro ? 'Registrar usuario' : 'Iniciar sesión';
    }
  };

  form.onsubmit = e => {
    e.preventDefault();
    const username = (document.getElementById('usuario') as HTMLInputElement)?.value || '';
    const password = (document.getElementById('password') as HTMLInputElement)?.value || '';

    if (modoRegistro) {
      registrarUsuario(username, password);
    } else if (login(username, password)) {
      modal.classList.add('hidden');
      actualizarUIUsuario();
    }
  };

  // NUEVO: Manejador para el botón Comprar (agregado aquí)
  btnComprar.addEventListener('click', () => {
    const carrito = cargarCarrito();
    if (carrito.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de comprar.');
      return;
    }

    // Simular procesamiento de compra (vaciar carrito y actualizar UI)
    localStorage.removeItem('carrito');
    window.dispatchEvent(new CustomEvent('carrito:change'));
    
    // Opcional: Guardar la orden en localStorage para historial (expansión futura)
    // const orden = { usuario: getUsuarioActual(), items: carrito, total: calcularTotal(carrito), fecha: new Date().toISOString() };
    // const ordenes = getLocal('ordenes') || [];
    // setLocal('ordenes', [...ordenes, orden]);

    alert(`¡Compra realizada con éxito! Total pagado: $${calcularTotal(carrito).toFixed(2)}.`);
  });

  actualizarUIUsuario();
}

// Inicialización
window.addEventListener('DOMContentLoaded', async () => {
  await initUsuarios();
  renderCatalogo();
  renderCarrito();
  setupAuth();
});

window.addEventListener('carrito:change', renderCarrito);