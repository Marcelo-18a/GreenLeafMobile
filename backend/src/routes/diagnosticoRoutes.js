const express = require('express');
const router = express.Router();
const Diagnostico = require('../models/Diagnostico'); 
const authMiddleware = require('../middlewares/authMiddleware'); 

// ROTA POST: Salva um novo diagnóstico
router.post('/', authMiddleware, async (req, res) => {
    try {
        const dadosDiagnostico = { ...req.body, user: req.userId };
        const novoDiagnostico = new Diagnostico(dadosDiagnostico);
        await novoDiagnostico.save();
        res.status(201).json(novoDiagnostico);
    } catch (error) {
        console.error("Erro ao salvar:", error);
        res.status(500).json({ error: 'Erro ao salvar diagnóstico' });
    }
});

// ROTA GET: Busca o histórico do usuário logado
router.get('/', authMiddleware, async (req, res) => {
    try {
        const historico = await Diagnostico.find({ user: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro ao buscar:", error);
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
});

// ROTA PUT: Edita o statusText ou a descrição de um diagnóstico específico
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { statusText, descricao } = req.body;

        // Procura o item pelo ID e garante que ele pertence ao usuário logado
        const diagnosticoAtualizado = await Diagnostico.findOneAndUpdate(
            { _id: id, user: req.userId },
            { statusText, descricao },
            { new: true } // Retorna o documento já modificado
        );

        if (!diagnosticoAtualizado) {
            return res.status(446).json({ message: 'Registro não encontrado ou não autorizado' });
        }

        res.status(200).json(diagnosticoAtualizado);
    } catch (error) {
        console.error("Erro ao editar:", error);
        res.status(500).json({ error: 'Erro ao editar registro' });
    }
});

// ROTA DELETE: Remove um diagnóstico específico do banco
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Remove o item se o ID bater e se o dono for o usuário logado
        const diagnosticoDeletado = await Diagnostico.findOneAndDelete({ _id: id, user: req.userId });

        if (!diagnosticoDeletado) {
            return res.status(446).json({ message: 'Registro não encontrado ou não autorizado' });
        }

        res.status(200).json({ message: 'Diagnóstico removido com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar:", error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
    }
});

module.exports = router;