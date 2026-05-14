const Event = require('../models/Event');
const { validationResult } = require('express-validator');

/**
 * @desc    Registrar un nuevo evento y calcular su cotización
 * @route   POST /api/eventos
 * @access  Público
 */
const createEvent = async (req, res) => {
    // 1. Verificación de Seguridad: Validar y sanitizar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    try {
        const { 
            nombre, telefono, correo, fechaEvento, tipoEvento, 
            direccion, numeroPersonas, paquete, cantidadHoras 
        } = req.body;

        // --- NUEVO: CANDADO DE FECHAS ---
        // Buscamos si ya existe un evento registrado exactamente en esa misma fecha
        const fechaOcupada = await Event.findOne({ fechaEvento });
        
        if (fechaOcupada) {
            return res.status(400).json({ 
                mensaje: 'Lo sentimos, esta fecha ya está reservada por otro cliente. Por favor, elige un día diferente.' 
            });
        }
        // --------------------------------

        // 2. Lógica de Negocio: Cálculo de Precios Base
        let precioBase = 0;
        if (paquete === 'Servicio DJ') {
            precioBase = 5500;
        } else if (paquete === 'Premium') {
            precioBase = 7500;
        }

        // 3. Cálculo de Horas Extra ($1,200 por hora después de las primeras 5)
        let costoHorasExtra = 0;
        let horasExtra = 0;
        if (cantidadHoras > 5) {
            horasExtra = cantidadHoras - 5;
            costoHorasExtra = horasExtra * 1200;
        }

        // 4. Cálculo de recargos por aforo (Número de personas)
        let costoPersonas = 0;
        switch (numeroPersonas) {
            case '10-100': costoPersonas = 0; break;
            case '100-200': costoPersonas = 3000; break;
            case '200-300': costoPersonas = 5500; break;
            case '300 o más': costoPersonas = 7500; break;
        }

        // 5. Total Final de la Cotización
        const totalCotizado = precioBase + costoHorasExtra + costoPersonas;

        // 6. Persistencia: Guardar en MongoDB
        const newEvent = new Event({
            nombre, telefono, correo, fechaEvento, tipoEvento, 
            direccion, numeroPersonas, paquete, cantidadHoras, 
            horasExtra, totalCotizado
        });

        const savedEvent = await newEvent.save();

        res.status(201).json({
            mensaje: 'Cotización calculada y evento registrado con éxito',
            evento: savedEvent
        });

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al registrar el evento',
            error: error.message
        });
    }
};

/**
 * @desc    Obtener lista de eventos con filtros (Registro de ventas)
 * @route   GET /api/eventos
 * @access  Privado (Requiere Token JWT)
 */
const getEvents = async (req, res) => {
    try {
        // 1. Atrapamos los posibles filtros que nos mande el frontend por la URL
        const { estadoReserva, mes } = req.query;
        
        // 2. Creamos una consulta vacía (por defecto traerá todo)
        let query = {}; 

        // 3. Si el admin pide filtrar por estado (ej. ?estadoReserva=Pendiente)
        if (estadoReserva) {
            query.estadoReserva = estadoReserva;
        }

        // 4. Si el admin pide filtrar por mes (ej. ?mes=11 para noviembre)
        if (mes) {
            // Le decimos a MongoDB que extraiga el mes de la fecha guardada y lo compare
            query.$expr = { $eq: [{ $month: "$fechaEvento" }, parseInt(mes)] };
        }

        // 5. Ejecutamos la búsqueda con los filtros aplicados y ordenamos del más nuevo al más viejo
        const events = await Event.find(query).sort({ createdAt: -1 });
        
        // Devolvemos el total de resultados y el arreglo con los datos
        res.json({
            total: events.length,
            eventos: events
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los eventos',
            error: error.message
        });
    }
};


module.exports = {
    createEvent,
    getEvents
};