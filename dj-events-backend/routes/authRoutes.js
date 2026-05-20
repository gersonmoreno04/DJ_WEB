const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registrarAdmin, loginAdmin } = require('../controllers/authController');

// Validaciones de contraseña: mínimo 8 chars, al menos 1 número y 1 mayúscula
const passwordRules = check('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una mayúscula');

// POST /api/auth/register
router.post('/register', [
    check('correo', 'Incluye un correo válido').isEmail().normalizeEmail(),
    passwordRules
], registrarAdmin);

// POST /api/auth/login
router.post('/login', [
    check('correo', 'Incluye un correo válido').isEmail().normalizeEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty()
], loginAdmin);

module.exports = router;
