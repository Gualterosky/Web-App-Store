const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Obtener carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Viene del middleware de autenticación
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        attributes: ['id', 'nombre', 'descripcion', 'precio', 'imagen']
      }]
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.Product.precio * item.quantity);
    }, 0);

    res.json({
      items: cartItems,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Verificar si el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si ya está en el carrito
    const existingItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (existingItem) {
      // Actualizar cantidad
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json({ message: 'Cantidad actualizada', item: existingItem });
    }

    // Crear nuevo item en carrito
    const cartItem = await Cart.create({
      userId,
      productId,
      quantity
    });

    res.status(201).json({ message: 'Producto agregado al carrito', item: cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cantidad
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: 'Cantidad actualizada', item: cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await Cart.destroy({
      where: { id, userId }
    });

    if (result === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.destroy({ where: { userId } });
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};