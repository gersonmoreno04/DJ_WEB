const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Conectamos a la URI definida en las variables de entorno
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado exitosamente: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        process.exit(1); // Detiene el proceso si falla la base de datos
    }
};

module.exports = connectDB;