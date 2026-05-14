const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre del producto es obligatorio'], 
        trim: true 
    },
    precio: { 
        type: Number, 
        required: [true, 'El precio es obligatorio'] 
    },
    descripcion: { 
        type: String, 
        required: [true, 'La descripción es obligatoria'] 
    },
    medidas: { 
        type: String, 
        required: [true, 'Las medidas son obligatorias'] 
    },
    fotos: [{ 
        type: String // Será un arreglo de URLs de las imágenes
    }], 
    tags: [{ 
        type: String // Arreglo de palabras clave
    }], 
    color: { 
        type: String 
    },
    linkAmazon: { 
        type: String, 
        trim: true 
    }
}, {
    timestamps: true // Esto crea automáticamente los campos 'createdAt' y 'updatedAt'
});

module.exports = mongoose.model('Product', productSchema);