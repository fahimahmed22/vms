const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.get('/overview', authMiddleware, roleMiddleware('admin'), adminController.getOverview);
router.get('/requests', authMiddleware, roleMiddleware('admin'), adminController.getRequests);
router.get('/users', authMiddleware, roleMiddleware('admin'), adminController.getUsers);
router.post('/validate-qr', authMiddleware, roleMiddleware('admin'), adminController.validateQr);

module.exports = router;
