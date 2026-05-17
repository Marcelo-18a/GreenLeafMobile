const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não informado' });
    }

    return next();
};

module.exports = authMiddleware;