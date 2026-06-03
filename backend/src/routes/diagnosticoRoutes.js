const express = require('express');
const router = express.Router();
const Diagnostico = require('../models/Diagnostico'); 

// ROTA POST: Salva os dados do diagnóstico vindos do aplicativo
router.post('/', async (req, res) => {
    try {
        const novoDiagnostico = new Diagnostico(req.body);
        await novoDiagnostico.save();
        res.status(201).json(novoDiagnostico);
    } catch (error) {
        console.error("Erro ao salvar diagnóstico:", error);
        res.status(500).json({ error: 'Erro ao salvar diagnóstico no MongoDB' });
    }
});

// ROTA GET: Busca todo o histórico ordenado da foto mais recente para a mais antiga
router.get('/', async (req, res) => {
    try {
        const historico = await Diagnostico.find().sort({ createdAt: -1 });
        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        res.status(500).json({ error: 'Erro ao buscar dados do histórico' });
    }
});

module.exports = router;