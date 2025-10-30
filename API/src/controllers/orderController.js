const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingInfo, paymentMethod, promoCode, discount } = req.body;

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

    let subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.precio * item.quantity);
    }, 0);

    let discountAmount = 0;
    if (discount && discount > 0 && discount <= 100) {
      discountAmount = subtotal * (discount / 100);
    }

    const total = subtotal - discountAmount;

    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const orderItems = cartItems.map(item => ({
      productId: item.product.id,
      nombre: item.product.nombre,
      precio: item.product.precio,
      quantity: item.quantity,
      categoria: item.product.categoria,
      marca: item.product.marca
    }));

    const order = await Order.create({
      userId,
      orderNumber,
      total,
      subtotal,
      discount: discount || 0,
      discountAmount,
      promoCode: promoCode || null,
      shippingInfo,
      paymentMethod,
      items: orderItems,
      status: 'completado'
    });

    await Cart.destroy({ where: { userId } });

    return res.status(201).json({
      message: 'Compra realizada exitosamente',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        discount: order.discount,
        discountAmount: order.discountAmount,
        promoCode: order.promoCode,
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