const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); // <-- Importamos el validador
const { createEvent, getEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/eventos (Le agregamos un arreglo con las reglas de validación y sanitización)
router.post('/', [
    // .trim() quita espacios extra, .escape() convierte caracteres HTML peligrosos en texto plano
    check('nombre', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    
    // .isNumeric() asegura que no metan letras, .isLength() restringe el tamaño
    check('telefono', 'El teléfono debe contener al menos 10 números').isNumeric().isLength({ min: 10 }).trim().escape(),
    
    // .isEmail() verifica el formato con la @, .normalizeEmail() lo estandariza (ej. quita mayúsculas)
    check('correo', 'Debes incluir un correo electrónico válido').isEmail().normalizeEmail(),
    
    check('fechaEvento', 'La fecha del evento es obligatoria').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty().trim().escape()
], createEvent);

// GET /api/eventos (Ruta Privada)
router.get('/', protect, getEvents);

module.exports = router;