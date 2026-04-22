const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.get('/employees', authMiddleware, roleMiddleware('visitor'), visitorController.listEmployees);
router.post('/request-meeting', authMiddleware, roleMiddleware('visitor'), visitorController.requestMeeting);
router.get('/my-requests', authMiddleware, roleMiddleware('visitor'), visitorController.getVisitorRequests);

module.exports = router;
