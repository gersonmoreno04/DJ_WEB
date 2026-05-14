const express = require('express');
const router = express.Router();
const { registrarAdmin, loginAdmin } = require('../controllers/authController');

// Rutas públicas
// POST /api/auth/register
router.post('/register', registrarAdmin);

// POST /api/auth/login
router.post('/login', loginAdmin);

module.exports = router;