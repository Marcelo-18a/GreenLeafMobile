const express = require('express');

const { createUser, getUsers, loginUser, getMe, updateMe } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

module.exports = router;