const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    if (!nombre) return res.status(400).json({ message: 'Falta nombre' });

    const prod = await Product.create({ nombre, descripcion, precio, stock });
    return res.status(201).json(prod);
  } catch (err) {
    return res.status(500).json({ message: 'Error crear producto', error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const items = await Product.findAll();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: 'Error listar productos', error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: 'Error obtener producto', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

    const { nombre, descripcion, precio, stock } = req.body;
    if (nombre !== undefined) item.nombre = nombre;
    if (descripcion !== undefined) item.descripcion = descripcion;
    if (precio !== undefined) item.precio = precio;
    if (stock !== undefined) item.stock = stock;

    await item.save();
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: 'Error actualizar producto', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

    await item.destroy();
    return res.json({ message: 'Producto eliminado' });
  } catch (err) {
    return res.status(500).json({ message: 'Error eliminar producto', error: err.message });
  }
};
