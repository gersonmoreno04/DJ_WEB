const { MercadoPagoConfig, Preference } = require('mercadopago');

// @desc    Generar link de pago para el anticipo
const createPayment = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

        const body = {
            items: [{
                title: 'Anticipo Reserva DJ / Producción',
                quantity: 1,
                unit_price: 1500, 
                currency_id: 'MXN'
            }],
            back_urls: {
                success: 'http://localhost:5000/api/status', 
                failure: 'http://localhost:5000/api/status',
                pending: 'http://localhost:5000/api/status'
            },
            auto_return: 'approved',
            // Le decimos a Mercado Pago a qué ruta avisarnos
            notification_url: 'https://tu-dominio.com/api/pagos/webhook' 
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        res.status(200).json({ id: result.id, linkPago: result.init_point });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al generar el link', error: error.message });
    }
};

//Recibir la notificación de pago
const receiveWebhook = async (req, res) => {
    try {
        const payment = req.query;
        // Si Mercado Pago nos avisa que el evento fue un "pago"
        if (payment.type === 'payment') {
            console.log('🔔 ¡Mercado Pago nos notificó un pago!', payment);
        }
        
        res.status(200).send('Notificación recibida');
    } catch (error) {
        console.error('Error en el webhook:', error);
        res.status(500).send('Error interno');
    }
};

module.exports = {
    createPayment,
    receiveWebhook
};