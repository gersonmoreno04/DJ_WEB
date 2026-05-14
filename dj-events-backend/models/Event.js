const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    // Datos del Cliente recopilados del formulario
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'], 
        trim: true 
    },
    telefono: { 
        type: String, 
        required: [true, 'El teléfono es obligatorio'] 
    },
    correo: { 
        type: String, 
        required: [true, 'El correo es obligatorio'],
        lowercase: true
    },
    
    // Datos del Evento
    fechaEvento: { 
        type: Date, 
        required: [true, 'La fecha del evento es obligatoria'] 
    },
    tipoEvento: { 
        type: String, 
        enum: ['Interior', 'Exterior'], // Restringe los valores aceptados
        required: true 
    },
    direccion: { 
        type: String, 
        required: true 
    },
    numeroPersonas: {
        type: String,
        enum: ['10-100', '100-200', '200-300', '300 o más'],
        required: true
    },
    
    // Servicios Contratados
    paquete: {
        type: String,
        enum: ['Servicio DJ', 'Premium'],
        required: true
    },
    cantidadHoras: { 
        type: Number, 
        required: true, 
        default: 5 // El base es de 5 horas
    },
    horasExtra: { 
        type: Number, 
        default: 0 
    },

    // Datos Financieros calculados por nuestro Backend
    totalCotizado: { 
        type: Number, 
        required: true 
    },
    anticipoPagado: { 
        type: Boolean, 
        default: false // Cambiará a true cuando el webhook de Mercado Pago nos avise
    },
    estadoReserva: {
        type: String,
        enum: ['Pendiente', 'Anticipo Pagado', 'Completado', 'Cancelado'],
        default: 'Pendiente'
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Event', eventSchema);