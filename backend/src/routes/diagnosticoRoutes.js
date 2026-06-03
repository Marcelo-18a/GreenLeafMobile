const express = require('express');
const router = express.Router();
const Diagnostico = require('../models/Diagnostico'); 
const authMiddleware = require('../middlewares/authMiddleware'); 

// ROTA POST: Salva o diagnóstico amarrado ao req.userId do seu middleware
router.post('/', authMiddleware, async (req, res) => {
    try {
        const dadosDiagnostico = { 
            ...req.body, 
            user: req.userId // Ajustado para bater com seu authMiddleware (req.userId)
        };

        const novoDiagnostico = new Diagnostico(dadosDiagnostico);
        await novoDiagnostico.save();
        res.status(201).json(novoDiagnostico);
    } catch (error) {
        console.error("Erro ao salvar diagnóstico:", error);
        res.status(500).json({ error: 'Erro ao salvar diagnóstico no MongoDB' });
    }
});

// ROTA GET: Busca apenas as análises correspondentes ao req.userId logado
router.get('/', authMiddleware, async (req, res) => {
    try {
        const historico = await Diagnostico.find({ user: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        res.status(500).json({ error: 'Erro ao buscar dados do histórico' });
    }
});

module.exports = router;