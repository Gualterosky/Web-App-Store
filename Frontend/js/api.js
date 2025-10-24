// Archivo: js/api.js

const API_URL = "http://localhost:3000/api"; // URL base de tu backend

// Obtener todos los productos
export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
}

// Obtener un producto por ID
export async function obtenerProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`);
  if (!res.ok) throw new Error("Error al obtener producto");
  return await res.json();
}
