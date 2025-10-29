const API_URL = "http://localhost:3000/api"; 

export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
}

export async function obtenerProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`);
  if (!res.ok) throw new Error("Error al obtener producto");
  return await res.json();
}