const express = require('express');

const { createUser, getUsers, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.post('/', createUser);
router.post('/login', loginUser);

module.exports = router;