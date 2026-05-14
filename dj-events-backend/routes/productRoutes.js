const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { getProducts, createProduct, calculateShipping } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/productos (Público)
router.get('/', getProducts);

// POST /api/productos (Privado - requiere Token)
router.post('/', protect, createProduct);

// POST /api/productos/cotizar-envio (Público con Validación)
router.post('/cotizar-envio', [
    check('estado', 'El estado es obligatorio').not().isEmpty().trim().escape(),
    check('distanciaKm', 'La distancia debe ser un número válido').isNumeric()
], (req, res, next) => {
    // Escudo protector antes de ir al controlador
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
}, calculateShipping);

module.exports = router;