const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      correo,
      password: hashedPassword
    });

    res.status(201).json({ message: '✅ Usuario creado', user });
  } catch (error) {
    res.status(500).json({ message: '❌ Error al crear usuario', error });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al obtener usuarios', error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al obtener usuario', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.nombre = nombre || user.nombre;
    user.correo = correo || user.correo;

    await user.save();

    res.json({ message: '✅ Usuario actualizado', user });
  } catch (error) {
    res.status(500).json({ message: '❌ Error al actualizar usuario', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.json({ message: '🗑️ Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: '❌ Error al eliminar usuario', error });
  }
};
