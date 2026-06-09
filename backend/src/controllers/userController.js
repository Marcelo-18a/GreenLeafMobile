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

// 🌟 NOVA LÓGICA: ENVIA O CHAMADO DIRETAMENTE PARA O SEU WEBHOOK DO DISCORD
const enviarSuporteEmail = async (req, res) => {
    console.log("=== [SUPORTE DISCORD] Nova requisição recebida no backend ===");
    
    try {
        const { pergunta } = req.body;
        const arquivoImagem = req.file;

        if (!pergunta) {
            console.log("=== [SUPORTE DISCORD] Falha: Campo pergunta vazio ===");
            return res.status(400).json({ message: 'A pergunta do suporte é obrigatória.' });
        }

        console.log("=== [SUPORTE DISCORD] Buscando dados do produtor no MongoDB ===");
        const user = await User.findById(req.userId);
        const remetenteNome = user ? user.name : 'Produtor GreenLeaf';
        const remetenteEmail = user ? user.email : 'E-mail não identificado';

        const urlWebhook = process.env.DISCORD_WEBHOOK_URL;
        if (!urlWebhook) {
            console.error("=== [SUPORTE DISCORD] Erro: DISCORD_WEBHOOK_URL faltando no .env ===");
            return res.status(500).json({ message: 'Configuração do servidor incompleta.' });
        }

        // Criando o FormData multipart estruturado que o Discord exige para receber anexos
        const formDataDiscord = new FormData();

        // Template de texto limpo para renderizar direto no chat do Discord
        const conteudoMensagem = 
`🌱 **NOVO CHAMADO DE SUPORTE - GREENLEAF**
👤 **Produtor:** ${remetenteNome}
📧 **E-mail:** ${remetenteEmail}
⏰ **Horário:** ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

📝 **Dúvida/Problema Relatado:**
\`\`\`
${pergunta}
\`\`\``;

        formDataDiscord.append('content', conteudoMensagem);

        // Se o multer pegou a imagem enviada pelo app, transforma o buffer e anexa
        if (arquivoImagem) {
            console.log("=== [SUPORTE DISCORD] Convertendo e anexando o arquivo binário ===");
            const blob = new Blob([arquivoImagem.buffer], { type: arquivoImagem.mimetype });
            formDataDiscord.append('file', blob, arquivoImagem.originalname || 'suporte_screenshot.jpg');
        }

        console.log("=== [SUPORTE DISCORD] Disparando requisição POST para o Discord ===");
        const responseDiscord = await fetch(urlWebhook, {
            method: 'POST',
            body: formDataDiscord
        });

        if (responseDiscord.ok) {
            console.log("=== [SUPORTE DISCORD] Sucesso completo! ===");
            return res.status(200).json({ message: 'Sua dúvida foi encaminhada com sucesso para nossa equipe!' });
        } else {
            const erroTexto = await responseDiscord.text();
            console.error("=== [SUPORTE DISCORD] O Discord recusou a requisição: ===", erroTexto);
            return res.status(500).json({ message: 'Erro ao processar envio com o servidor de mensagens.' });
        }

    } catch (error) {
        console.error('=== [SUPORTE DISCORD] Erro Crítico ===', error);
        return res.status(500).json({ message: 'Erro interno ao tentar processar o chamado de suporte.' });
    }
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    getMe,
    updateMe,
    enviarSuporteEmail,
};