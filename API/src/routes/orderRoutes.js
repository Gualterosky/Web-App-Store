const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear orden (comprar)
router.post('/', orderController.createOrder);

// Obtener historial de órdenes
router.get('/', orderController.getUserOrders);

// Obtener detalle de orden
router.get('/:id', orderController.getOrderById);

module.exports = router;