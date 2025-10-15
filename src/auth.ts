import { Usuario } from "./models.js";
import { getLocal, setLocal } from './storage.js';

const KEY_USER = 'usuarios';
const SESSION_KEY = 'usuario_actual';

let usuarioActual: Usuario | null = null;

export function registrarUsuario(nombre: string, password: string, fotoPerfil: string = 'img/userDefault.png'): boolean {
  const usuarios = getLocal<Usuario[]>(KEY_USER) ?? [];
  if (usuarios.find(u => u.correo === nombre)) {
    alert("El usuario ya existe");
    return false;
  }
  const nuevoUsuario: Usuario = {
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

export function login(nombre: string, password: string): boolean {
  const usuarios = getLocal<Usuario[]>(KEY_USER) ?? [];
  const user = usuarios.find(u => u.correo === nombre && u.contrasena === password);
  if (!user) {
    alert("Usuario o contraseña incorrectos");
    return false;
  }
  usuarioActual = user;
  setLocal(SESSION_KEY, user);
  return true;
}

export function logout(): void {
  usuarioActual = null;
  localStorage.removeItem(SESSION_KEY);
}

export function getUsuarioActual(): Usuario | null {
  if (usuarioActual) return usuarioActual;
  return getLocal<Usuario>(SESSION_KEY) ?? null;
}

export function initAuth(): void {
  usuarioActual = getLocal<Usuario>(SESSION_KEY) ?? null;
}

export function guardarUsuariosComoJSON(): void {
  const usuarios = getLocal<Usuario[]>(KEY_USER) ?? [];
  const data = { usuarios };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'usuarios.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function initUsuarios(): Promise<void> {
  const usuariosExistentes = getLocal<Usuario[]>(KEY_USER);
  if (usuariosExistentes) {
    console.log('Usuarios ya cargados desde localStorage');
    return;
  }

  try {
    const response = await fetch('./usuarios.json');
    if (!response.ok) throw new Error('Error al cargar usuarios.json');
    const data = await response.json();
    const usuariosArray: Usuario[] = data.usuarios || [];
    setLocal(KEY_USER, usuariosArray);
    console.log('Usuarios cargados desde usuarios.json');
  } catch (error) {
    console.error('Error inicializando usuarios:', error);
  }
}