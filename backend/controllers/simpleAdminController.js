const db = require('../config/database');

const simpleAdminController = {
    // Получение статистики - БЕЗ ПРОВЕРКИ АВТОРИЗАЦИИ
    getStats: async (req, res) => {
        try {
            console.log('Получение статистики - доступ разрешен');

            const [stats] = await db.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
                FROM applications
            `);

            console.log('Статистика загружена:', stats[0]);
            res.json(stats[0]);
        } catch (error) {
            console.error('Ошибка получения статистики:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    },

    // Получение всех заявок - БЕЗ ПРОВЕРКИ АВТОРИЗАЦИИ
    getApplications: async (req, res) => {
        try {
            const { status } = req.query;
            
            console.log('Получение заявок с фильтром:', { status });

            let query = `
                SELECT 
                    a.id,
                    u.full_name as student_name,
                    u.email as student_email,
                    u.phone as student_phone,
                    c.name as course_name,
                    c.duration_months,
                    a.desired_start_date,
                    a.payment_method,
                    a.status,
                    a.admin_notes,
                    a.created_at,
                    a.updated_at
                FROM applications a
                JOIN users u ON a.user_id = u.id
                JOIN courses c ON a.course_id = c.id
            `;

            const params = [];

            if (status && status !== 'all') {
                query += ' WHERE a.status = ?';
                params.push(status);
            }

            query += ' ORDER BY a.created_at DESC';

            const [applications] = await db.execute(query, params);

            console.log(`Загружено ${applications.length} заявок`);
            res.json(applications);
        } catch (error) {
            console.error('Ошибка получения заявок:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    },

    // Обновление статуса заявки - БЕЗ ПРОВЕРКИ АВТОРИЗАЦИИ
    updateApplicationStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, admin_notes } = req.body;

            console.log('Обновление статуса заявки:', { id, status });

            if (!status) {
                return res.status(400).json({ 
                    error: 'Статус обязателен' 
                });
            }

            const validStatuses = ['pending', 'approved', 'completed', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ 
                    error: 'Неверный статус' 
                });
            }

            const [result] = await db.execute(
                `UPDATE applications 
                 SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [status, admin_notes || null, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Заявка не найдена' });
            }

            console.log('Статус заявки обновлен:', id);
            res.json({ message: 'Статус заявки обновлен' });

        } catch (error) {
            console.error('Ошибка обновления заявки:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    },

    // Удаление заявки - БЕЗ ПРОВЕРКИ АВТОРИЗАЦИИ
    deleteApplication: async (req, res) => {
        try {
            const { id } = req.params;

            console.log('Удаление заявки:', { id });

            const [result] = await db.execute(
                'DELETE FROM applications WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Заявка не найдена' });
            }

            console.log('Заявка удалена:', id);
            res.json({ message: 'Заявка удалена' });

        } catch (error) {
            console.error('Ошибка удаления заявки:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
};

module.exports = simpleAdminController;