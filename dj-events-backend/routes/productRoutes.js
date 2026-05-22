const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { getProducts, createProduct, calculateShipping } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

//ruta de los productos al publico
router.get('/', getProducts);
//Ruta de productos con token 
router.post('/', protect, createProduct);
//ruta para cotizar el envio
router.post('/cotizar-envio', [
    check('estado', 'El estado es obligatorio').not().isEmpty().trim().escape(),
    check('distanciaKm', 'La distancia debe ser un número válido').isNumeric()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
}, calculateShipping);

module.exports = router;
