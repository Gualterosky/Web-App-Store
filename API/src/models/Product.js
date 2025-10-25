const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'escritorio, portatil, componentes, perifericos'
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Intel, AMD, ASUS, Dell, etc'
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL o nombre de archivo de imagen'
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;