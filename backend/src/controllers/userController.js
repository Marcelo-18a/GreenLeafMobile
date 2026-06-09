const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

// CONFIGURAÇÃO DO TRANSMISSOR DO NODEMAILER UTILIZANDO AS VARIÁVEIS DO .ENV
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SUPORTE,
        pass: process.env.EMAIL_SENHA_APP
    }
});

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

// NOVA FUNÇÃO: PROCESSA A MENSAGEM DO SUPORTE E DISPARA O E-MAIL
const enviarSuporteEmail = async (req, res) => {
    try {
        const { pergunta } = req.body;
        const arquivoImagem = req.file; // Capturado pelo multer configurado nas rotas

        if (!pergunta) {
            return res.status(400).json({ message: 'A pergunta do suporte é obrigatória.' });
        }

        // Busca os dados atualizados do produtor que fez a requisição usando o middleware de autenticação
        const user = await User.findById(req.userId);
        const remetenteNome = user ? user.name : 'Produtor GreenLeaf';
        const remetenteEmail = user ? user.email : 'E-mail não identificado';

        // Montagem do corpo do e-mail com layout HTML profissional
        const mailOptions = {
            from: `"GreenLeaf Suporte" <${process.env.EMAIL_SUPORTE}>`,
            to: process.env.EMAIL_SUPORTE, // Envia para a sua própria caixa de entrada definida no .env
            subject: '🌱 Novo Chamado de Suporte Técnico - GreenLeaf',
            html: `
                <div style="font-family: sans-serif; padding: 25px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fdfdfd;">
                    <h2 style="color: #57b947; border-bottom: 2px solid #57b947; padding-bottom: 12px; margin-top: 0; font-size: 22px;">Novo Chamado Técnico Recebido</h2>
                    <p style="margin: 6px 0; font-size: 14px;"><strong>Produtor:</strong> ${remetenteNome}</p>
                    <p style="margin: 6px 0; font-size: 14px;"><strong>E-mail cadastrado:</strong> ${remetenteEmail}</p>
                    <p style="margin: 6px 0; font-size: 14px;"><strong>Horário do Envio:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
                    
                    <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; margin-top: 20px; border: 1px solid #e2e2e2; border-left: 5px solid #444444;">
                        <p style="margin: 0 0 10px 0; font-weight: bold; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Mensagem enviada:</p>
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #111; white-space: pre-line;">${pergunta}</p>
                    </div>
                    
                    ${arquivoImagem 
                        ? '<p style="margin-top: 22px; color: #555; font-size: 13px; font-weight: 500;">📌 A captura de tela anexada pelo produtor foi integrada com sucesso e está disponível em anexo abaixo.</p>' 
                        : '<p style="margin-top: 22px; color: #999; font-size: 13px; font-style: italic;">O produtor optou por não anexar imagens a este chamado.</p>'
                    }
                </div>
            `,
            attachments: []
        };

        // Se houver anexo binário enviado pelo Multer, insere no array do Nodemailer
        if (arquivoImagem) {
            mailOptions.attachments.push({
                filename: arquivoImagem.originalname || 'suporte_screenshot.jpg',
                content: arquivoImagem.buffer // Injeta o buffer diretamente da RAM
            });
        }

        // Executa o envio seguro
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Sua dúvida foi encaminhada com sucesso para nossa equipe!' });

    } catch (error) {
        console.error('Erro no controller de suporte:', error);
        return res.status(500).json({ message: 'Erro interno ao tentar processar ou encaminhar o e-mail de suporte.' });
    }
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    getMe,
    updateMe,
    enviarSuporteEmail, // Exportação da nova função adicionada
};