const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
// 1. IMPORTA A NOVA ROTA DO HISTÓRICO DE DIAGNÓSTICOS
const diagnosticoRoutes = require('./routes/diagnosticoRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Rotas da API
app.use('/api/users', userRoutes);

// 2. PLUGA O ENDPOINT DE DIAGNÓSTICOS PARA O APP ACESSAR
app.use('/api/diagnosticos', diagnosticoRoutes);

// Tratamento de rota não encontrada (Deve ficar sempre abaixo de todas as rotas válidas)
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

module.exports = app;