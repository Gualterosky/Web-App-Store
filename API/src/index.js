const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Servidor funcionando correctamente');
});

sequelize.sync()
  .then(() => {
    console.log('📦 Base de datos sincronizada correctamente');
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar la base de datos:', error);
  });
