const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenleaf';

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar no MongoDB:', error.message);
    }
};

module.exports = connectDB;