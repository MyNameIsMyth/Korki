const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.verifyToken);

router.get('/', applicationController.getUserApplications);
router.post('/', applicationController.createApplication);
router.post('/review', applicationController.createReview);

module.exports = router;