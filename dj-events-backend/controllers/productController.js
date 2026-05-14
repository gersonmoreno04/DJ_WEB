const Product = require('../models/Product');

// @desc    Obtener todos los productos (Público, para la Landing Page)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
};

// @desc    Crear un nuevo producto (Privado, solo para el Administrador)
const createProduct = async (req, res) => {
    try {
        const { nombre, precio, descripcion, medidas, fotos, tags, color, linkAmazon } = req.body;

        const product = new Product({
            nombre,
            precio,
            descripcion,
            medidas,
            fotos,
            tags,
            color,
            linkAmazon
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el producto', error: error.message });
    }
};

// @desc    Calcular el costo de envío de un producto
// @route   POST /api/productos/cotizar-envio
// @access  Público
const calculateShipping = async (req, res) => {
    try {
        const { estado, distanciaKm } = req.body;
        
        let costoEnvio = 0;
        let mensaje = '';
        let requiereCotizacionManual = false;

        // Regla 1: Si no es CDMX, es Interior de la República
        if (estado.toUpperCase() !== 'CDMX' && estado.toUpperCase() !== 'CIUDAD DE MEXICO' && estado.toUpperCase() !== 'CIUDAD DE MÉXICO') {
            costoEnvio = null;
            mensaje = 'Envío al interior de la república. Nos pondremos en contacto para cotizar.';
            requiereCotizacionManual = true;
        } 
        // Regla 2: Es CDMX y está a 5km o menos (Radio del Estadio Azteca)
        else if (distanciaKm <= 5) {
            costoEnvio = 0;
            mensaje = '¡Felicidades! Tu envío es totalmente GRATIS.';
        } 
        // Regla 3: Es CDMX pero a más de 5km
        else {
            costoEnvio = 200;
            mensaje = 'Envío estándar dentro de la CDMX.';
        }

        res.json({
            estadoDestino: estado,
            distanciaCalculada: `${distanciaKm} km`,
            costoEnvio,
            mensaje,
            requiereCotizacionManual
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al calcular el envío', error: error.message });
    }
};

// No olvides exportar esta tercera función
module.exports = {
    getProducts,
    createProduct,
    calculateShipping // <-- Añade esta línea
};

