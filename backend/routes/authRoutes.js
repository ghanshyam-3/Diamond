const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getAllUsers, 
  getUserDetails,
  updateUserRole,
  deleteUser
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (owner only)
router.get('/users', protect, getAllUsers);
router.get('/users/:id', protect, getUserDetails);
router.put('/users/:id/role', protect, updateUserRole);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
