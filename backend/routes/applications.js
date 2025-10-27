const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// Применяем middleware ко всем маршрутам
router.use(authMiddleware);

// Маршруты
router.get('/courses', applicationController.getCourses);
router.get('/applications', applicationController.getUserApplications);
router.post('/applications', applicationController.createApplication);
router.post('/reviews', applicationController.createReview);

module.exports = router;