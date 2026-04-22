const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.get('/requests', authMiddleware, roleMiddleware('employee'), employeeController.getRequestsForEmployee);
router.post('/accept-request', authMiddleware, roleMiddleware('employee'), employeeController.acceptRequest);
router.post('/reject-request', authMiddleware, roleMiddleware('employee'), employeeController.rejectRequest);

module.exports = router;
