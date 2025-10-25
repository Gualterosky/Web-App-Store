// seedProducts.js - Script para poblar la base de datos con productos
// Coloca este archivo en: API/src/seedProducts.js

const sequelize = require('./config/database');
const Product = require('./models/Product');

const productos = [
  // ESCRITORIO
  {
    nombre: "PC Gamer Intel Core i5 12va Gen",
    descripcion: "Computadora de escritorio con procesador Intel Core i5 de 12ª generación, ideal para gaming y trabajo intensivo. Incluye 16GB RAM y SSD de 512GB.",
    precio: 2100000,
    stock: 15,
    categoria: "escritorio",
    marca: "Intel"
  },
  {
    nombre: "PC Workstation AMD Ryzen 7",
    descripcion: "Estación de trabajo profesional con procesador AMD Ryzen 7, 32GB RAM, SSD 1TB. Perfecta para diseño y edición.",
    precio: 2850000,
    stock: 10,
    categoria: "escritorio",
    marca: "AMD"
  },
  {
    nombre: "PC All-in-One Dell Inspiron 24",
    descripcion: "Computadora todo en uno con pantalla táctil de 24 pulgadas, procesador Intel i7, 16GB RAM.",
    precio: 2300000,
    stock: 8,
    categoria: "escritorio",
    marca: "Dell"
  },

  // PORTÁTILES
  {
    nombre: "Laptop Dell Inspiron 15",
    descripcion: "Portátil versátil de 15.6 pulgadas, Intel Core i5, 8GB RAM, SSD 256GB. Ideal para trabajo y entretenimiento.",
    precio: 1670000,
    stock: 25,
    categoria: "portatil",
    marca: "Dell"
  },
  {
    nombre: "Laptop ASUS TUF Gaming F15",
    descripcion: "Laptop gaming con Intel Core i7, NVIDIA GTX 1650, 16GB RAM, SSD 512GB. Pantalla 144Hz.",
    precio: 3200000,
    stock: 12,
    categoria: "portatil",
    marca: "ASUS"
  },
  {
    nombre: "MacBook Air M2",
    descripcion: "Ultrabook Apple con chip M2, 8GB RAM unificada, SSD 256GB. Ultraligera y potente.",
    precio: 4500000,
    stock: 6,
    categoria: "portatil",
    marca: "Apple"
  },
  {
    nombre: "Laptop Lenovo ThinkPad E14",
    descripcion: "Laptop empresarial con Intel Core i5, 16GB RAM, SSD 512GB. Construcción robusta.",
    precio: 2100000,
    stock: 18,
    categoria: "portatil",
    marca: "Lenovo"
  },

  // COMPONENTES
  {
    nombre: "Tarjeta Gráfica NVIDIA RTX 4070 Ti",
    descripcion: "GPU de última generación con 12GB GDDR6X, ideal para gaming 4K y renderizado profesional.",
    precio: 3480000,
    stock: 8,
    categoria: "componentes",
    marca: "NVIDIA"
  },
  {
    nombre: "Tarjeta Gráfica AMD Radeon RX 7800 XT",
    descripcion: "GPU AMD con 16GB GDDR6, excelente rendimiento en 1440p y ray tracing.",
    precio: 2950000,
    stock: 10,
    categoria: "componentes",
    marca: "AMD"
  },
  {
    nombre: "Procesador Intel Core i9-13900K",
    descripcion: "CPU de 24 núcleos (8P+16E), hasta 5.8GHz, ideal para gaming y creación de contenido.",
    precio: 2200000,
    stock: 15,
    categoria: "componentes",
    marca: "Intel"
  },
  {
    nombre: "Procesador AMD Ryzen 9 7950X",
    descripcion: "CPU de 16 núcleos y 32 hilos, hasta 5.7GHz, perfecto para workstations.",
    precio: 2500000,
    stock: 12,
    categoria: "componentes",
    marca: "AMD"
  },
  {
    nombre: "Memoria RAM Corsair Vengeance 32GB DDR5",
    descripcion: "Kit de 2x16GB DDR5 6000MHz, RGB, compatible con Intel y AMD.",
    precio: 580000,
    stock: 30,
    categoria: "componentes",
    marca: "Corsair"
  },
  {
    nombre: "SSD Samsung 980 PRO 1TB NVMe",
    descripcion: "Unidad de estado sólido PCIe 4.0, velocidades de hasta 7000MB/s lectura.",
    precio: 420000,
    stock: 40,
    categoria: "componentes",
    marca: "Samsung"
  },
  {
    nombre: "Fuente de Poder Corsair RM850x 850W",
    descripcion: "PSU modular 80 Plus Gold, totalmente silenciosa, ideal para sistemas potentes.",
    precio: 520000,
    stock: 20,
    categoria: "componentes",
    marca: "Corsair"
  },

  // PERIFÉRICOS
  {
    nombre: "Teclado Mecánico Logitech G Pro X",
    descripcion: "Teclado gaming mecánico con switches GX Blue, RGB LIGHTSYNC, TKL.",
    precio: 480000,
    stock: 35,
    categoria: "perifericos",
    marca: "Logitech"
  },
  {
    nombre: "Mouse Gaming Logitech G502 HERO",
    descripcion: "Mouse ergonómico con sensor HERO 25K, 11 botones programables, pesas ajustables.",
    precio: 195000,
    stock: 50,
    categoria: "perifericos",
    marca: "Logitech"
  },
  {
    nombre: "Monitor Gaming ASUS TUF 27\" 165Hz",
    descripcion: "Monitor curvo 1440p, 165Hz, 1ms, HDR400, FreeSync Premium.",
    precio: 1250000,
    stock: 15,
    categoria: "perifericos",
    marca: "ASUS"
  },
  {
    nombre: "Monitor Dell UltraSharp 32\" 4K",
    descripcion: "Monitor profesional IPS 4K, 99% sRGB, USB-C con 90W Power Delivery.",
    precio: 2100000,
    stock: 8,
    categoria: "perifericos",
    marca: "Dell"
  },
  {
    nombre: "Audífonos HyperX Cloud II",
    descripcion: "Headset gaming con sonido 7.1 virtual, micrófono desmontable, almohadillas de memory foam.",
    precio: 320000,
    stock: 45,
    categoria: "perifericos",
    marca: "HyperX"
  },
  {
    nombre: "Webcam Logitech C920 HD Pro",
    descripcion: "Cámara web Full HD 1080p, micrófono dual, enfoque automático.",
    precio: 280000,
    stock: 30,
    categoria: "perifericos",
    marca: "Logitech"
  },
  {
    nombre: "Kit Teclado y Mouse Inalámbrico Logitech MK270",
    descripcion: "Combo inalámbrico para oficina, batería de larga duración, diseño compacto.",
    precio: 120000,
    stock: 60,
    categoria: "perifericos",
    marca: "Logitech"
  },
  {
    nombre: "Silla Gamer DXRacer Formula",
    descripcion: "Silla ergonómica para gaming, respaldo reclinable 180°, cojines lumbar y cervical.",
    precio: 1350000,
    stock: 10,
    categoria: "perifericos",
    marca: "DXRacer"
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    
    console.log('📦 Sincronizando modelos...');
    await sequelize.sync();
    
    console.log('🗑️  Limpiando productos existentes...');
    await Product.destroy({ where: {}, truncate: true });
    
    console.log('✨ Creando productos...');
    const createdProducts = await Product.bulkCreate(productos);
    
    console.log(`✅ ${createdProducts.length} productos creados exitosamente!`);
    console.log('\n📊 Resumen por categoría:');
    
    const categorias = {};
    createdProducts.forEach(p => {
      categorias[p.categoria] = (categorias[p.categoria] || 0) + 1;
    });
    
    Object.entries(categorias).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} productos`);
    });
    
    console.log('\n🎉 Base de datos poblada exitosamente!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;