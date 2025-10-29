const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);

router.post('/add', cartController.addToCart);

router.put('/:id', cartController.updateCartItem);

router.delete('/:id', cartController.removeFromCart);

router.delete('/', cartController.clearCart);

module.exports = router;