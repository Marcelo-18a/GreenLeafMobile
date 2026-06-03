const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const diagnosticoRoutes = require('./routes/diagnosticoRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/diagnosticos', diagnosticoRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

module.exports = app;