export interface Usuario{
    id: number;
    correo: string;
    contrasena: string;
    fotoPerfil: string;
}

export interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    direccion: string;
    genero: string;    
    usuario: Usuario;
}

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria?: Categoria;
    stock: number;
    imagen: string;
}

export interface Carrito {
  producto: Producto;
  cantidad: number;
}