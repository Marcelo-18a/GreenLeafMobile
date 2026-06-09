const User = require('../models/User');
const Notification = require('../models/Notification'); // Importando o model de notificações
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

// 🌟 FUNÇÃO DE SUPORTE ADAPTADA PARA GERAR OS LINKS DE CONTROLE NO CARD DO DISCORD
const enviarSuporteEmail = async (req, res) => {
    console.log("=== [SUPORTE DISCORD] Nova requisição recebida no backend ===");
    
    try {
        const { pregunta } = req.body; // Mantendo o mapeamento correto do seu formulário do app
        const arquivoImagem = req.file;

        const perguntaTexto = pergunta;

        if (!perguntaTexto) {
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

        // URL base do Render para construir o link que o atendente vai clicar de dentro do Discord
        const urlDoServidor = 'https://greenleafmobile.onrender.com';

        const formDataDiscord = new FormData();

        // Template injetando as duas ações clicáveis para o administrador do suporte
        const conteudoMensagem = 
`🌱 **NOVO CHAMADO DE SUPORTE - GREENLEAF**
👤 **Produtor:** ${remetenteNome}
📧 **E-mail:** ${remetenteEmail}
⏰ **Horário:** ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

📝 **Dúvida/Problema Relatado:**
\`\`\`
${perguntaTexto}
\`\`\`

📥 **Painel de Ações do Atendente:**
✉️ [**1. Responder por E-mail (Abrir Gmail)**](https://mail.google.com/mail/?view=cm&fs=1&to=${remetenteEmail}&su=Re:+Chamado+de+Suporte+GreenLeaf)
🚀 [**2. Notificar Produtor no App (Marcar como Respondido)**](${urlDoServidor}/api/users/notifications/trigger-reply/${req.userId})`;

        formDataDiscord.append('content', conteudoMensagem);

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
            return res.status(200).json({ message: 'Sua dúvida foi encaminhada com sucesso!' });
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

// 🌟 NOVA FUNÇÃO: DISPARADA QUANDO O LINK DO DISCORD É CLICADO NO NAVEGADOR
const triggerNotificationReply = async (req, res) => {
    try {
        const { idProdutor } = req.params;

        // Cria a notificação de resposta enviada diretamente na conta do produtor no MongoDB
        await Notification.create({
            userId: idProdutor,
            tipo: 'suporte',
            titulo: '💬 Suporte Respondido!',
            mensagem: 'A nossa equipe técnica analisou o seu chamado e acabou de enviar as instruções detalhadas de correção para o seu e-mail cadastrado. Confira a sua caixa de entrada!'
        });

        // Retorna um HTML básico de sucesso para o atendente ver na tela do PC ao clicar
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 60px 20px;">
                <div style="max-width: 450px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h1 style="color: #57b947; margin-bottom: 10px;">✓ Sucesso Técnico!</h1>
                    <p style="font-size: 16px; color: #444; line-height: 1.5;">A notificação de atendimento concluído foi injetada diretamente no celular do produtor rural no banco de dados.</p>
                </div>
            </div>
        `);
    } catch (error) {
        console.error('Erro no gatilho de notificação:', error);
        res.status(500).send('Erro interno do servidor ao tentar processar o gatilho.');
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar notificações' });
    }
};

const updateNotificationsRead = async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            await Notification.updateMany({ _id: id, userId: req.userId }, { lida: true });
        } else {
            await Notification.updateMany({ userId: req.userId, lida: false }, { lida: true });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar notificações' });
    }
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    getMe,
    updateMe,
    enviarSuporteEmail,
    triggerNotificationReply, // Exportando o novo gatilho do Discord
    getNotifications,
    updateNotificationsRead
};