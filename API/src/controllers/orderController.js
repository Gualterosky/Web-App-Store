const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Crear orden (procesar compra)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingInfo, paymentMethod } = req.body;

    // Obtener items del carrito
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Calcular total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.precio * item.quantity);
    }, 0);

    // Crear número de orden único
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Formatear items para guardar
    const orderItems = cartItems.map(item => ({
      productId: item.product.id,
      nombre: item.product.nombre,
      precio: item.product.precio,
      quantity: item.quantity,
      categoria: item.product.categoria,
      marca: item.product.marca
    }));

    // Crear orden
    const order = await Order.create({
      userId,
      orderNumber,
      total,
      shippingInfo,
      paymentMethod,
      items: orderItems,
      status: 'completado'
    });

    // Vaciar carrito después de comprar
    await Cart.destroy({ where: { userId } });

    return res.status(201).json({
      message: 'Compra realizada exitosamente',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Error al crear orden:', error);
    return res.status(500).json({ 
      message: 'Error al procesar la compra', 
      error: error.message 
    });
  }
};

// Obtener historial de órdenes del usuario
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      orders,
      count: orders.length
    });

  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return res.status(500).json({ 
      message: 'Error al obtener historial', 
      error: error.message 
    });
  }
};

// Obtener detalle de una orden
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId }
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    return res.json(order);

  } catch (error) {
    console.error('Error al obtener orden:', error);
    return res.status(500).json({ 
      message: 'Error al obtener orden', 
      error: error.message 
    });
  }
};