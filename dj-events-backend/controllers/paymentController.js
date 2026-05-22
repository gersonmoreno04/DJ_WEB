const { MercadoPagoConfig, Preference } = require('mercadopago');
const crypto = require('crypto');

//Generar link de pago 
const createPayment = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const body = {
            items: [{
                title: 'Anticipo Reserva DJ / Producción GDL',
                quantity: 1,
                unit_price: 1500,
                currency_id: 'MXN'
            }],
            back_urls: {
                success: `${frontendUrl}/reserva?estado=exitoso`,
                failure: `${frontendUrl}/reserva?estado=fallido`,
                pending: `${frontendUrl}/reserva?estado=pendiente`
            },
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.status(200).json({ id: result.id, linkPago: result.init_point });
    } catch (error) {
        console.error('[ERROR CREAR PREFERENCIA MP]:', error); 
        res.status(500).json({ mensaje: 'Error al generar el link de pago.' });
    }
};
//Recibir la notificacion de mercado pago 
const receiveWebhook = async (req, res) => {
    try {
        const xSignature   = req.headers['x-signature'];
        const xRequestId   = req.headers['x-request-id'];
        const secret       = process.env.MERCADOPAGO_WEBHOOK_SECRET;
        if (secret && xSignature && xRequestId) {
            const dataId = req.query['data.id'] || req.body?.data?.id || '';
            const manifest = `id:${dataId};request-id:${xRequestId};ts:${xSignature.split(',').find(p => p.startsWith('ts=')).split('=')[1]};`;
            const [, v1] = xSignature.split(',').find(p => p.startsWith('v1='))?.split('=') || [];
            const hash = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
            if (hash !== v1) {
                console.warn('[WEBHOOK] Firma inválida — posible petición falsa.');
                return res.status(401).send('Firma inválida.');
            }
        }
        const payment = req.query;
        if (payment.type === 'payment') {
            console.log('[WEBHOOK] Pago recibido:', payment['data.id']);
        }
        res.status(200).send('OK');
    } catch (error) {
    console.error('[PAGO ERROR]', error); // ← cambia esta línea
    res.status(500).json({ mensaje: 'Error al generar el link de pago.' });
}
};

module.exports = { createPayment, receiveWebhook };
