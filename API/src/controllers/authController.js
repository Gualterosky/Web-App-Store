const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ message: 'Faltan datos' });

    const user = await User.findOne({ where: { correo } });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Credenciales inválidas' });

    const payload = { id: user.id, correo: user.correo };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

    const { password: _, ...userData } = user.toJSON();

    return res.json({ user: userData, token });
  } catch (err) {
    return res.status(500).json({ message: 'Error en login', error: err.message });
  }
};

exports.getAuthInfo = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  return res.json({ user: req.user });
};
