const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');

    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(401).json({ message: 'Usuario no existe' });

    req.user = user.toJSON();
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado', error: err.message });
  }
};
