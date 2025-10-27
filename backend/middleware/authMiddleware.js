const authMiddleware = (req, res, next) => {
    // В реальном проекте здесь была бы проверка JWT токена
    // Для демо просто проверяем наличие пользователя в заголовках
    const user = req.headers['x-user-id'] ? {
        id: parseInt(req.headers['x-user-id']),
        login: req.headers['x-user-login']
    } : null;

    if (!user) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }

    req.user = user;
    next();
};

module.exports = authMiddleware;