const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tipo: {
        type: String,
        enum: ['alerta', 'suporte', 'campo'],
        default: 'campo'
    },
    titulo: {
        type: String,
        required: true
    },
    mensagem: {
        type: String,
        required: true
    },
    lida: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);