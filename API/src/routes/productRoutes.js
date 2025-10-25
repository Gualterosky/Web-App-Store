const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Rutas PÚBLICAS (sin autenticación)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// ✨ TEMPORAL: Crear productos sin autenticación (para poblar BD)
// En producción deberías proteger esto con un rol de ADMIN
router.post('/', productController.createProduct);

// Rutas PROTEGIDAS (requieren autenticación de ADMIN)
// Por ahora las dejamos sin protección para que puedas crear productos
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;