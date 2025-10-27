const adminAuthMiddleware = (req, res, next) => {
    try {
        // ПРОСТАЯ ПРОВЕРКА - разрешаем доступ без проверки заголовков
        // Для демо-версии всегда разрешаем доступ
        req.admin = {
            id: 1,
            username: 'Admin'
        };
        
        console.log('Доступ разрешен для администратора');
        next();
    } catch (error) {
        console.error('Ошибка в admin middleware:', error);
        return res.status(401).json({ error: 'Ошибка авторизации администратора' });
    }
};

module.exports = adminAuthMiddleware;