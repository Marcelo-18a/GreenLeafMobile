const express = require('express');
const multer = require('multer');

// Importação das funções do Controller (Adicionada a nova função 'enviarSuporteEmail')
const { createUser, getUsers, loginUser, getMe, updateMe, enviarSuporteEmail } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// 🛠️ CORREÇÃO AQUI: Inicializando a instância do multer na memória RAM
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('imagem'); // 'imagem' deve ser idêntico ao do FormData do app

// Suas rotas existentes do Usuário
router.get('/', authMiddleware, getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

// ROTA DO SUPORTE: O 'upload' agora sim processa o arquivo corretamente antes de ir pro controller
router.post('/suporte', authMiddleware, upload, enviarSuporteEmail);

module.exports = router;