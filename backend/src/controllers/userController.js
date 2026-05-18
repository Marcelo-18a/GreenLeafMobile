const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

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

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email: normalizedEmail, password: hashed });

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

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                photoUri: user.photoUri || '',
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
};

const updateMe = async (req, res) => {
    try {
        const { name, photoUri } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        if (typeof name === 'string') user.name = name.trim();
        if (typeof photoUri === 'string') user.photoUri = photoUri;

        await user.save();

        res.json({ id: user._id, name: user.name, email: user.email, photoUri: user.photoUri || '' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    getMe,
    updateMe,
};