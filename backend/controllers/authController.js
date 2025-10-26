const db = require('../config/database');
const passwordUtils = require('../utils/passwordUtils');

const authController = {
    // Регистрация пользователя
    register: async (req, res) => {
        try {
            const { login, password, full_name, phone, email } = req.body;

            // Проверка обязательных полей
            if (!login || !password || !full_name || !phone || !email) {
                return res.status(400).json({ 
                    error: 'Все поля обязательны для заполнения' 
                });
            }

            // Проверка формата логина
            const loginRegex = /^[A-Za-z0-9]{6,}$/;
            if (!loginRegex.test(login)) {
                return res.status(400).json({ 
                    error: 'Логин должен содержать только латинские буквы и цифры, минимум 6 символов' 
                });
            }

            // Проверка длины пароля
            if (password.length < 8) {
                return res.status(400).json({ 
                    error: 'Пароль должен быть не менее 8 символов' 
                });
            }

            // Проверка формата ФИО
            const nameRegex = /^[А-Яа-яЁё\s]+$/;
            if (!nameRegex.test(full_name)) {
                return res.status(400).json({ 
                    error: 'ФИО должно содержать только кириллические символы и пробелы' 
                });
            }

            // Проверка формата телефона
            const phoneRegex = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ 
                    error: 'Телефон должен быть в формате: 8(XXX)XXX-XX-XX' 
                });
            }

            // Проверка уникальности логина
            const [existingLogin] = await db.execute(
                'SELECT id FROM users WHERE login = ?', 
                [login]
            );

            if (existingLogin.length > 0) {
                return res.status(400).json({ 
                    error: 'Пользователь с таким логином уже существует' 
                });
            }

            // Проверка уникальности email
            const [existingEmail] = await db.execute(
                'SELECT id FROM users WHERE email = ?', 
                [email]
            );

            if (existingEmail.length > 0) {
                return res.status(400).json({ 
                    error: 'Пользователь с таким email уже существует' 
                });
            }

            // Хеширование пароля
            const passwordHash = await passwordUtils.hashPassword(password);

            // Создание пользователя
            const [result] = await db.execute(
                `INSERT INTO users (login, password_hash, full_name, phone, email) 
                 VALUES (?, ?, ?, ?, ?)`,
                [login, passwordHash, full_name, phone, email]
            );

            res.status(201).json({
                message: 'Пользователь успешно зарегистрирован',
                userId: result.insertId
            });

        } catch (error) {
            console.error('Ошибка регистрации:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    },

    // Авторизация пользователя
    login: async (req, res) => {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return res.status(400).json({ 
                    error: 'Логин и пароль обязательны' 
                });
            }

            // Поиск пользователя
            const [users] = await db.execute(
                `SELECT id, login, password_hash, full_name, email, phone 
                 FROM users WHERE login = ? AND is_active = 1`,
                [login]
            );

            if (users.length === 0) {
                return res.status(401).json({ 
                    error: 'Неверный логин или пароль' 
                });
            }

            const user = users[0];

            // Проверка пароля
            const isPasswordValid = await passwordUtils.comparePassword(password, user.password_hash);

            if (!isPasswordValid) {
                return res.status(401).json({ 
                    error: 'Неверный логин или пароль' 
                });
            }

            // В реальном проекте здесь генерировался бы JWT токен
            res.json({
                message: 'Авторизация успешна',
                user: {
                    id: user.id,
                    login: user.login,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone
                }
            });

        } catch (error) {
            console.error('Ошибка авторизации:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
};

module.exports = authController;