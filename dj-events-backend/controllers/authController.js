const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función auxiliar para generar el JWT
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El token expira en 30 días
    });
};

// @desc    Registrar un nuevo administrador (Usaremos esto solo una vez)
const registrarAdmin = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // Verificamos si ya existe alguien con ese correo
        const userExists = await User.findOne({ correo });
        if (userExists) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        // Creamos el usuario (nuestro modelo User.js se encargará de encriptar el password automáticamente)
        const user = await User.create({
            correo,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                correo: user.correo,
                token: generarToken(user._id)
            });
        } else {
            res.status(400).json({ mensaje: 'Datos de usuario inválidos' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// @desc    Autenticar usuario y conseguir el Token (LOGIN)
const loginAdmin = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Buscamos al usuario por su correo
        const user = await User.findOne({ correo });

        // 2. Verificamos que el usuario exista y que la contraseña coincida
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                correo: user.correo,
                token: generarToken(user._id)
            });
        } else {
            res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
    registrarAdmin,
    loginAdmin
};