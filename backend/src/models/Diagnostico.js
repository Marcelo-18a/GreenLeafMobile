const mongoose = require('mongoose');

const DiagnosticoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photoUri: {
        type: String,
        required: true
    },
    statusText: {
        type: String,
        required: true
    },
    probabilidade: {
        type: Number,
        required: true
    },
    cor: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    // Novas propriedades geográficas para o mapa de calor
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Diagnostico', DiagnosticoSchema);