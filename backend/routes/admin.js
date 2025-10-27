const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const adminAuthMiddleware = require('../middleware/adminAuthMiddleware'); // Закомментировать

// Временно отключаем middleware для тестирования
// router.use(adminAuthMiddleware);

// Маршруты
router.get('/stats', adminController.getStats);
router.get('/applications', adminController.getApplications);
router.put('/applications/:id', adminController.updateApplicationStatus);
router.delete('/applications/:id', adminController.deleteApplication);

module.exports = router;