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

exports.register = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      correo,
      password: hashedPassword
    });

    const payload = { id: newUser.id, correo: newUser.correo };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

    const { password: _, ...userData } = newUser.toJSON();

    return res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: userData, 
      token 
    });

  } catch (err) {
    console.error('Error en registro:', err);
    return res.status(500).json({ message: 'Error en registro', error: err.message });
  }
};

exports.getAuthInfo = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  return res.json({ user: req.user });
};