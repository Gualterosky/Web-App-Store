const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', orderController.createOrder);

router.get('/', orderController.getUserOrders);

router.get('/:id', orderController.getOrderById);

module.exports = router;