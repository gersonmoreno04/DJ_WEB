const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Obtener todos los productos (Público)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos.' });
    }
};

// @desc    Crear producto (Admin)
const createProduct = async (req, res) => {
    try {
        const { nombre, precio, descripcion, medidas, fotos, tags, color, linkAmazon } = req.body;

        // Validar que las fotos sean URLs y no scripts
        if (fotos && !fotos.every(f => /^https?:\/\//.test(f))) {
            return res.status(400).json({ mensaje: 'Las fotos deben ser URLs válidas (https).' });
        }

        const product = new Product({ nombre, precio, descripcion, medidas, fotos, tags, color, linkAmazon });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el producto.' });
    }
};

// @desc    Eliminar producto (Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        res.json({ mensaje: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto.' });
    }
};

// @desc    Cotizar envío
const calculateShipping = async (req, res) => {
    try {
        const { estado, distanciaKm } = req.body;
        const e = estado.toUpperCase().trim();

        let costoEnvio, mensaje, requiereCotizacionManual = false;

        if (!['CDMX', 'CIUDAD DE MEXICO', 'CIUDAD DE MÉXICO'].includes(e)) {
            costoEnvio = null;
            mensaje = 'Envío al interior de la república. Nos pondremos en contacto para cotizar.';
            requiereCotizacionManual = true;
        } else if (distanciaKm <= 5) {
            costoEnvio = 0;
            mensaje = '¡Tu envío es totalmente GRATIS!';
        } else {
            costoEnvio = 200;
            mensaje = 'Envío estándar dentro de la CDMX.';
        }

        res.json({ estadoDestino: estado, distanciaCalculada: `${distanciaKm} km`, costoEnvio, mensaje, requiereCotizacionManual });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al calcular el envío.' });
    }
};

module.exports = { getProducts, createProduct, deleteProduct, calculateShipping };
