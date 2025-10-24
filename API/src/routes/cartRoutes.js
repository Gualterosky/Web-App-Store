const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas del carrito requieren autenticación
router.use(authMiddleware);

// Obtener carrito del usuario
router.get('/', cartController.getCart);

// Agregar producto al carrito
router.post('/add', cartController.addToCart);

// Actualizar cantidad de un item
router.put('/:id', cartController.updateCartItem);

// Eliminar item del carrito
router.delete('/:id', cartController.removeFromCart);

// Vaciar todo el carrito
router.delete('/', cartController.clearCart);

module.exports = router;