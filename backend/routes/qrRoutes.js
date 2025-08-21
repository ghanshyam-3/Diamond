const express = require('express');
const router = express.Router();
const { generateDiamondQR } = require('../controllers/qrController');
const { protect } = require('../middleware/authMiddleware');

router.get('/qr/:id', protect, generateDiamondQR);

module.exports = router;
