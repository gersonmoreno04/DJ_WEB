require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();
connectDB();
//Paaquete de seguridad
app.use(helmet());
//Restringe mis peticiones https
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { mensaje: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' }
});

//Reducimos las peticiones para evitar ataques de fuierza bruta
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { mensaje: 'Demasiados intentos de acceso. Espera 15 minutos.' }
});

app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));
//rutas
const eventRoutes   = require('./routes/eventRoutes');
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/eventos',   eventRoutes);
app.use('/api/auth',      authLimiter, authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pagos',     paymentRoutes);
// ── Ruta de health check 
app.get('/api/status', (req, res) => {
    res.json({ mensaje: 'Servidor seguro y funcionando correctamente' });
});
//Manejo global de errores
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    const status = err.status || 500;
    res.status(status).json({
        mensaje: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor.'
            : err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
