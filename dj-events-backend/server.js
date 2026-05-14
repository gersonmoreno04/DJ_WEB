require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const cors = require('cors'); 
app.use(cors()); 

// Inicializar la app y conectar a la BD
const app = express();
connectDB();

// Middlewares de Seguridad y Parseo
app.use(helmet()); 
app.use(cors()); 
app.use(express.json());
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/eventos', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pagos', paymentRoutes);

// Ruta de prueba base
app.get('/api/status', (req, res) => {
    res.json({ mensaje: 'Servidor seguro y funcionando correctamente 🚀' });
});

// Configuración del Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});