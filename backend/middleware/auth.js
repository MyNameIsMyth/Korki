const jwt = require('jsonwebtoken');

const authMiddleware = {
    // Простая проверка (в реальном проекте используйте JWT)
    verifyToken: (req, res, next) => {
        // Для демо-проекта пропускаем всех
        // В реальном проекте здесь была бы проверка JWT токена
        req.user = { id: 1 }; // Заглушка для демо
        next();
        
        /*
        // Реальная реализация:
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Неверный токен' });
        }
        */
    }
};

module.exports = authMiddleware;