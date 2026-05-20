const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// @desc    Registrar nuevo evento y calcular cotización
// @route   POST /api/eventos
// @access  Público
const createEvent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    try {
        const {
            nombre, telefono, correo, fechaEvento, tipoEvento,
            direccion, numeroPersonas, paquete, cantidadHoras
        } = req.body;

        // Verificar disponibilidad de fecha
        const fechaOcupada = await Event.findOne({ fechaEvento });
        if (fechaOcupada) {
            return res.status(400).json({
                mensaje: 'Lo sentimos, esta fecha ya está reservada. Por favor elige un día diferente.'
            });
        }

        // Precio base
        let precioBase = 0;
        if (paquete === 'Servicio DJ') precioBase = 5500;
        else if (paquete === 'Premium')   precioBase = 7500;

        // Horas extra
        let horasExtra = 0;
        let costoHorasExtra = 0;
        if (cantidadHoras > 5) {
            horasExtra = cantidadHoras - 5;
            costoHorasExtra = horasExtra * 1200;
        }

        // Recargo por aforo — FIX: '300+' ahora acepta ambas variantes
        const personasMap = {
            '10-100':    0,
            '100-200':   3000,
            '200-300':   5500,
            '300 o más': 7500,
            '300+':      7500  // ← FIX: alias del frontend
        };
        const costoPersonas = personasMap[numeroPersonas] ?? 0;

        const totalCotizado = precioBase + costoHorasExtra + costoPersonas;

        const newEvent = new Event({
            nombre, telefono, correo, fechaEvento, tipoEvento,
            direccion,
            // Normalizar a valor canónico del enum
            numeroPersonas: numeroPersonas === '300+' ? '300 o más' : numeroPersonas,
            paquete, cantidadHoras, horasExtra, totalCotizado
        });

        const savedEvent = await newEvent.save();
        res.status(201).json({
            mensaje: 'Evento registrado con éxito.',
            evento: savedEvent
        });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar el evento.' });
    }
};

// @desc    Obtener eventos (admin)
// @route   GET /api/eventos
// @access  Privado
const getEvents = async (req, res) => {
    try {
        const { estadoReserva, mes } = req.query;
        let query = {};
        if (estadoReserva) query.estadoReserva = estadoReserva;
        if (mes) query.$expr = { $eq: [{ $month: '$fechaEvento' }, parseInt(mes)] };

        const events = await Event.find(query).sort({ createdAt: -1 });
        res.json({ total: events.length, eventos: events });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los eventos.' });
    }
};

// @desc    Eliminar evento (admin)
// @route   DELETE /api/eventos/:id
// @access  Privado
const deleteEvent = async (req, res) => {
    try {
        const evento = await Event.findByIdAndDelete(req.params.id);
        if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado.' });
        res.json({ mensaje: 'Evento eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el evento.' });
    }
};

module.exports = { createEvent, getEvents, deleteEvent };
