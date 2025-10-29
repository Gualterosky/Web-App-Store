const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock']
      }],
      order: [['createdAt', 'DESC']]
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.precio * item.quantity);
    }, 0);

    return res.json({
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      count: cartItems.length
    });
  } catch (err) {
    console.error('Error al obtener carrito:', err);
    return res.status(500).json({ 
      message: 'Error al obtener carrito', 
      error: err.message 
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId es requerido' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles` 
      });
    }

    const existingItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({ 
          message: `Stock insuficiente. Solo puedes agregar ${product.stock - existingItem.quantity} unidades más` 
        });
      }

      existingItem.quantity = newQuantity;
      await existingItem.save();

      const updatedItem = await Cart.findByPk(existingItem.id, {
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock']
        }]
      });

      return res.json({ 
        message: 'Cantidad actualizada en el carrito',
        item: updatedItem
      });
    }

    const cartItem = await Cart.create({
      userId,
      productId,
      quantity
    });

    const newItem = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock']
      }]
    });

    return res.status(201).json({ 
      message: 'Producto agregado al carrito',
      item: newItem
    });

  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    return res.status(500).json({ 
      message: 'Error al agregar al carrito', 
      error: err.message 
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
    }

    const cartItem = await Cart.findOne({
      where: { id, userId },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item no encontrado en tu carrito' });
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ 
        message: `Stock insuficiente. Solo hay ${cartItem.product.stock} unidades disponibles` 
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedItem = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock']
      }]
    });

    return res.json({ 
      message: 'Cantidad actualizada',
      item: updatedItem
    });

  } catch (err) {
    console.error('Error al actualizar item:', err);
    return res.status(500).json({ 
      message: 'Error al actualizar item', 
      error: err.message 
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item no encontrado en tu carrito' });
    }

    await cartItem.destroy();

    return res.json({ message: 'Producto eliminado del carrito' });

  } catch (err) {
    console.error('Error al eliminar item:', err);
    return res.status(500).json({ 
      message: 'Error al eliminar item', 
      error: err.message 
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.destroy({ 
      where: { userId } 
    });

    return res.json({ message: 'Carrito vaciado correctamente' });

  } catch (err) {
    console.error('Error al vaciar carrito:', err);
    return res.status(500).json({ 
      message: 'Error al vaciar carrito', 
      error: err.message 
    });
  }
};