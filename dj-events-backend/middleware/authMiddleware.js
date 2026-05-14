const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Verificamos si en la petición viene la cabecera de Autorización con un token "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extraemos el token (cortamos la cadena por el espacio: "Bearer <token_largo>")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verificamos que el token sea válido usando nuestra llave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Buscamos al administrador en la BD y lo adjuntamos a la petición (req.user)
            // Usamos .select('-password') para asegurarnos de NUNCA devolver la contraseña
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Todo está correcto, le decimos a Express que continúe con la ruta original
            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ mensaje: 'No autorizado, token fallido o expirado' });
        }
    }

    // Si terminó de revisar y no encontró ningún token, bloqueamos el paso
    if (!token) {
        res.status(401).json({ mensaje: 'No autorizado, no hay token provisto' });
    }
};

module.exports = { protect };