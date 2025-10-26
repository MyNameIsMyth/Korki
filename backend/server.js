const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Простые маршруты для теста
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Сервер работает корректно',
        timestamp: new Date().toISOString()
    });
});

// Тестовый маршрут для пользователей
app.get('/api/test', (req, res) => {
    res.json({ message: 'Тестовый маршрут работает!' });
});

// Обработка 404 - самый простой вариант
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🌐 API доступно по: http://localhost:${PORT}/api`);
});