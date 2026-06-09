const express = require('express');
const multer = require('multer');

const { 
    createUser, 
    getUsers, 
    loginUser, 
    getMe, 
    updateMe, 
    enviarSuporteEmail,
    triggerNotificationReply, // Importando a nova função
    getNotifications,
    updateNotificationsRead
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('imagem');

router.get('/', authMiddleware, getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

router.post('/suporte', authMiddleware, upload, enviarSuporteEmail);

// 🌟 ROTAS DE NOTIFICAÇÕES
router.get('/notifications', authMiddleware, getNotifications);
router.put('/notifications/read', authMiddleware, updateNotificationsRead);

// 🌟 GATILHO DO DISCORD: Link de acesso do atendente para notificar o celular do usuário
router.get('/notifications/trigger-reply/:idProdutor', triggerNotificationReply);

module.exports = router;