const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Middleware de Mongoose: Encriptar la contraseña antes de guardar
userSchema.pre('save', async function() {
    // Si la contraseña no ha sido modificada, terminamos la ejecución aquí
    if (!this.isModified('password')) {
        return;
    }
    // Generamos un "salt" (una cadena aleatoria) y hasheamos la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método personalizado para comparar la contraseña que ingresa el usuario con la encriptada
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);