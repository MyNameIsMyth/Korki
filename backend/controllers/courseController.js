const db = require('../config/database');

const courseController = {
    // Получение всех активных курсов
    getAllCourses: async (req, res) => {
        try {
            const [courses] = await db.execute(
                `SELECT 
                    id,
                    name,
                    description,
                    duration_months,
                    price
                 FROM courses 
                 WHERE is_active = 1
                 ORDER BY name`
            );

            res.json(courses);

        } catch (error) {
            console.error('Ошибка получения курсов:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    },

    // Получение курса по ID
    getCourseById: async (req, res) => {
        try {
            const courseId = req.params.id;

            const [courses] = await db.execute(
                `SELECT 
                    id,
                    name,
                    description,
                    duration_months,
                    price
                 FROM courses 
                 WHERE id = ? AND is_active = 1`,
                [courseId]
            );

            if (courses.length === 0) {
                return res.status(404).json({ error: 'Курс не найден' });
            }

            res.json(courses[0]);

        } catch (error) {
            console.error('Ошибка получения курса:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
};

module.exports = courseController;