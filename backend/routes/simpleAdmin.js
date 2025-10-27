const express = require('express');
const router = express.Router();
const simpleAdminController = require('../controllers/simpleAdminController');

// Маршруты БЕЗ middleware - полный доступ
router.get('/stats', simpleAdminController.getStats);
router.get('/applications', simpleAdminController.getApplications);
router.put('/applications/:id', simpleAdminController.updateApplicationStatus);
router.delete('/applications/:id', simpleAdminController.deleteApplication);

module.exports = router;