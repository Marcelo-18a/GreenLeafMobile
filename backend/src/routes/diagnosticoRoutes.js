const express = require('express');
const router = express.Router();
const Diagnostico = require('../models/Diagnostico'); 
const authMiddleware = require('../middlewares/authMiddleware'); // Importa seu middleware de autenticação

// ROTA POST: Salva o diagnóstico atrelando-o ao ID do usuário logado
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Injeta o ID do usuário autenticado no corpo do diagnóstico
        const dadosDiagnostico = {
            ...req.body,
            user: req.user.id 
        };

        const novoDiagnostico = new Diagnostico(dadosDiagnostico);
        await novoDiagnostico.save();
        res.status(201).json(novoDiagnostico);
    } catch (error) {
        console.error("Erro ao salvar diagnóstico por usuário:", error);
        res.status(500).json({ error: 'Erro ao salvar diagnóstico no MongoDB' });
    }
});

// ROTA GET: Busca o histórico filtrando apenas os diagnósticos do usuário logado
router.get('/', authMiddleware, async (req, res) => {
    try {
        const historico = await Diagnostico.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro ao buscar histórico do usuário:", error);
        res.status(500).json({ error: 'Erro ao buscar dados do histórico' });
    }
});

module.exports = router;