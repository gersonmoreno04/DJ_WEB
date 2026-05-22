const express = require('express');
const router = express.Router();
const { createPayment, receiveWebhook } = require('../controllers/paymentController');
router.post('/crear-link', createPayment);
router.post('/webhook', receiveWebhook);
module.exports = router;
