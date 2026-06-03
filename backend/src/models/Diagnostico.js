const mongoose = require('mongoose');

const DiagnosticoSchema = new mongoose.Schema({
    photoUri: { type: String, required: true },
    statusText: { type: String, required: true },
    probabilidade: { type: Number, required: true },
    cor: { type: String, required: true },
    descricao: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diagnostico', DiagnosticoSchema);