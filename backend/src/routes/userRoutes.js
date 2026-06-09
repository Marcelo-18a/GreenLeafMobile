const express = require('express');
const multer = require('multer');

// Mantendo o seu padrão de desestruturação e adicionando a nova função 'enviarSuporteEmail'
const { createUser, getUsers, loginUser, getMe, updateMe, enviarSuporteEmail } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Configuração do Multer para ler o arquivo enviado temporariamente na memória RAM do servidor
const storage = multer.memoryStorage();
const upload = multer.single('imagem'); // 'imagem' é o mesmo nome que usamos no FormData lá no React Native

// Suas rotas existentes
router.get('/', authMiddleware, getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

// NOVA ROTA: Envio de Suporte Técnico por E-mail
// O 'upload' processa a imagem do FormData e o 'enviarSuporteEmail' faz o disparo com Nodemailer
router.post('/suporte', authMiddleware, upload, enviarSuporteEmail);

module.exports = router;