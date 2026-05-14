const express = require('express');
const router = express.Router();
const { createPayment, receiveWebhook } = require('../controllers/paymentController');

// POST /api/pagos/crear-link (Público)
router.post('/crear-link', createPayment);

// POST /api/pagos/webhook (Ruta oculta donde Mercado Pago nos mandará información)
router.post('/webhook', receiveWebhook);

module.exports = router;