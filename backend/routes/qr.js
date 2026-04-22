const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.get('/accepted/:requestId', authMiddleware, roleMiddleware('visitor'), qrController.getAcceptedRequestQRCode);

module.exports = router;
