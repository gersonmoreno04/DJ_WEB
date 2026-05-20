const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '8h' // Reducido de 30d a 8h — sesión de trabajo razonable
    });
};

// @desc    Registrar administrador
// @route   POST /api/auth/register
const registrarAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { correo, password } = req.body;
    try {
        const userExists = await User.findOne({ correo });
        if (userExists) {
            // Mismo mensaje que "no existe" para no revelar si el correo está registrado
            return res.status(400).json({ mensaje: 'No se pudo completar el registro.' });
        }
        const user = await User.create({ correo, password });
        if (user) {
            res.status(201).json({
                _id: user._id,
                correo: user.correo,
                token: generarToken(user._id)
            });
        } else {
            res.status(400).json({ mensaje: 'Datos de usuario inválidos.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};

// @desc    Login administrador
// @route   POST /api/auth/login
const loginAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { correo, password } = req.body;
    try {
        const user = await User.findOne({ correo });
        // Mensaje genérico — no revela si el correo existe o no (user enumeration)
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                correo: user.correo,
                token: generarToken(user._id)
            });
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};

module.exports = { registrarAdmin, loginAdmin };
