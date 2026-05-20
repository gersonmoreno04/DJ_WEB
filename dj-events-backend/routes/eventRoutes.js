const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { createEvent, getEvents, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', [
    check('nombre',      'El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('telefono',    'El teléfono debe tener al menos 10 dígitos').isNumeric().isLength({ min: 10 }).trim(),
    check('correo',      'Incluye un correo válido').isEmail().normalizeEmail(),
    check('fechaEvento', 'La fecha del evento es obligatoria').not().isEmpty(),
    check('direccion',   'La dirección es obligatoria').not().isEmpty().trim().escape(),
    check('paquete',     'Paquete inválido').isIn(['Servicio DJ', 'Premium']),
    check('numeroPersonas', 'Número de personas inválido')
        .isIn(['10-100', '100-200', '200-300', '300 o más', '300+']),
    check('cantidadHoras', 'Mínimo 5 horas').isInt({ min: 5, max: 24 })
], createEvent);

router.get('/',        protect, getEvents);
router.delete('/:id',  protect, deleteEvent);

module.exports = router;
