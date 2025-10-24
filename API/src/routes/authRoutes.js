const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.login);

// ✨ NUEVA: Ruta de registro
router.post('/register', authController.register);

router.get('/me', authMiddleware, authController.getAuthInfo);

module.exports = router;