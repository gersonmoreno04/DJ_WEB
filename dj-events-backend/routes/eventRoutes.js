const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); 
const { createEvent, getEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('telefono', 'El teléfono debe contener al menos 10 números').isNumeric().isLength({ min: 10 }).trim().escape(),
    
    check('correo', 'Debes incluir un correo electrónico válido').isEmail().normalizeEmail(),
    
    check('fechaEvento', 'La fecha del evento es obligatoria').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty().trim().escape()
], createEvent);

router.get('/', protect, getEvents);

module.exports = router;