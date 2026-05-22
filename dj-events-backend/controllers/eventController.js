const Event = require('../models/Event');
const { validationResult } = require('express-validator');

//Registrar nuevo evento y se cotiza
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
        // Recargo por aforo 
        const personasMap = {
            '10-100':    0,
            '100-200':   3000,
            '200-300':   5500,
            '300 o más': 7500,
            '300+':      7500
        };
        const costoPersonas = personasMap[numeroPersonas] ?? 0;
        const totalCotizado = precioBase + costoHorasExtra + costoPersonas;
        const newEvent = new Event({
            nombre, telefono, correo, fechaEvento, tipoEvento,
            direccion,
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
//Obtener los eventos
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
//Eliminar evento
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
