const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
        }

        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: 'Usuário já cadastrado' });
        }

        const user = await User.create({ name, email: normalizedEmail, password });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login' });
    }
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
};