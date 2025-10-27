const db = require('../config/database');

const applicationController = {
    // Получение списка курсов
    getCourses: async (req, res) => {
        try {
            const [courses] = await db.execute(
                'SELECT id, name, description, duration_months, price FROM courses WHERE is_active = 1'
            );

            res.json(courses);
        } catch (error) {
            console.error('Ошибка получения курсов:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    },

    // Получение заявок пользователя
    getUserApplications: async (req, res) => {
        try {
            const userId = req.user.id;

            const [applications] = await db.execute(
                `SELECT 
                    a.id,
                    c.name as course_name,
                    c.description,
                    c.duration_months,
                    a.desired_start_date,
                    a.payment_method,
                    a.status,
                    a.created_at,
                    r.rating,
                    r.review_text,
                    r.created_at as review_date
                 FROM applications a
                 JOIN courses c ON a.course_id = c.id
                 LEFT JOIN reviews r ON a.id = r.application_id
                 WHERE a.user_id = ?
                 ORDER BY a.created_at DESC`,
                [userId]
            );

            const formattedApplications = applications.map(app => ({
                id: app.id,
                courseName: app.course_name,
                description: app.description,
                duration: app.duration_months,
                startDate: app.desired_start_date.toISOString().split('T')[0],
                paymentMethod: app.payment_method,
                status: app.status,
                createdAt: app.created_at,
                hasReview: !!app.rating,
                review: app.rating ? {
                    rating: app.rating,
                    text: app.review_text,
                    date: app.review_date
                } : null
            }));

            res.json(formattedApplications);

        } catch (error) {
            console.error('Ошибка получения заявок:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    },

    // Создание новой заявки
    createApplication: async (req, res) => {
        try {
            const userId = req.user.id;
            const { course_id, desired_start_date, payment_method } = req.body;

            if (!course_id || !desired_start_date || !payment_method) {
                return res.status(400).json({ 
                    error: 'Все поля обязательны для заполнения' 
                });
            }

            // Проверка существования курса
            const [courses] = await db.execute(
                'SELECT id FROM courses WHERE id = ? AND is_active = 1',
                [course_id]
            );

            if (courses.length === 0) {
                return res.status(404).json({ error: 'Курс не найден' });
            }

            // Создание заявки
            const [result] = await db.execute(
                `INSERT INTO applications (user_id, course_id, desired_start_date, payment_method) 
                 VALUES (?, ?, ?, ?)`,
                [userId, course_id, desired_start_date, payment_method]
            );

            res.status(201).json({
                message: 'Заявка успешно создана',
                applicationId: result.insertId
            });

        } catch (error) {
            console.error('Ошибка создания заявки:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    },

    // Создание отзыва
    createReview: async (req, res) => {
        try {
            const userId = req.user.id;
            const { application_id, rating, review_text } = req.body;

            if (!application_id || !rating || !review_text) {
                return res.status(400).json({ 
                    error: 'Все поля обязательны для заполнения' 
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({ 
                    error: 'Рейтинг должен быть от 1 до 5' 
                });
            }

            // Проверка что заявка существует и принадлежит пользователю
            const [applications] = await db.execute(
                `SELECT a.id 
                 FROM applications a 
                 WHERE a.id = ? AND a.user_id = ? AND a.status = 'completed'`,
                [application_id, userId]
            );

            if (applications.length === 0) {
                return res.status(404).json({ 
                    error: 'Заявка не найдена или нельзя оставить отзыв' 
                });
            }

            // Проверка что отзыв еще не оставлен
            const [existingReviews] = await db.execute(
                'SELECT id FROM reviews WHERE application_id = ?',
                [application_id]
            );

            if (existingReviews.length > 0) {
                return res.status(400).json({ 
                    error: 'Отзыв для этой заявки уже оставлен' 
                });
            }

            // Создание отзыва
            const [result] = await db.execute(
                `INSERT INTO reviews (application_id, rating, review_text) 
                 VALUES (?, ?, ?)`,
                [application_id, rating, review_text]
            );

            res.status(201).json({
                message: 'Отзыв успешно оставлен',
                reviewId: result.insertId
            });

        } catch (error) {
            console.error('Ошибка создания отзыва:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
};

module.exports = applicationController;