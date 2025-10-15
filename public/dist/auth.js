import { getLocal, setLocal } from './storage.js';
const KEY_USER = 'usuarios';
const SESSION_KEY = 'usuario_actual';
let usuarioActual = null;
export function registrarUsuario(nombre, password, fotoPerfil = 'img/userDefault.png') {
    const usuarios = getLocal(KEY_USER) ?? [];
    if (usuarios.find(u => u.correo === nombre)) {
        alert("El usuario ya existe");
        return false;
    }
    const nuevoUsuario = {
        id: Date.now(),
        correo: nombre,
        contrasena: password,
        fotoPerfil
    };
    usuarios.push(nuevoUsuario);
    setLocal(KEY_USER, usuarios);
    alert("Usuario registrado con exito");
    return true;
}
export function login(nombre, password) {
    const usuarios = getLocal(KEY_USER) ?? [];
    const user = usuarios.find(u => u.correo === nombre && u.contrasena === password);
    if (!user) {
        alert("Usuario o contraseña incorrectos");
        return false;
    }
    usuarioActual = user;
    setLocal(SESSION_KEY, user);
    return true;
}
export function logout() {
    usuarioActual = null;
    localStorage.removeItem(SESSION_KEY);
}
export function getUsuarioActual() {
    if (usuarioActual)
        return usuarioActual;
    return getLocal(SESSION_KEY) ?? null;
}
export function initAuth() {
    usuarioActual = getLocal(SESSION_KEY) ?? null;
}
export function guardarUsuariosComoJSON() {
    const usuarios = getLocal(KEY_USER) ?? [];
    const data = { usuarios };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.json';
    a.click();
    URL.revokeObjectURL(url);
}
export async function initUsuarios() {
    const usuariosExistentes = getLocal(KEY_USER);
    if (usuariosExistentes) {
        console.log('Usuarios ya cargados desde localStorage');
        return;
    }
    try {
        const response = await fetch('./usuarios.json');
        if (!response.ok)
            throw new Error('Error al cargar usuarios.json');
        const data = await response.json();
        const usuariosArray = data.usuarios || [];
        setLocal(KEY_USER, usuariosArray);
        console.log('Usuarios cargados desde usuarios.json');
    }
    catch (error) {
        console.error('Error inicializando usuarios:', error);
    }
}
