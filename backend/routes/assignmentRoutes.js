const express = require('express');
const router = express.Router();
const { approveDiamond, assignDiamond, getEmployeeAssignments, getManagerAssignments, completeAssignment, verifyAndMarkPolished } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const {
  getCurrentMonthEarnings,
  getEarningsHistory,
  getAllEmployeesEarnings
} = require('../controllers/assignmentController');

// Owner approves diamond
router.put('/approve/:id', protect, approveDiamond);

// Manager assigns diamond
router.post('/assign', protect, assignDiamond);

router.get('/assign/employee', protect, getEmployeeAssignments);
router.get('/assign/manager', protect, getManagerAssignments);
router.put('/assign/complete/:id', protect, completeAssignment);
router.put('/assign/verify/:id', protect, verifyAndMarkPolished);
router.get('/earnings', protect, getCurrentMonthEarnings);
router.get('/earnings/history', protect, getEarningsHistory);
router.get('/earnings/all', protect, getAllEmployeesEarnings);


module.exports = router;
