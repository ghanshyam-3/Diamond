const express = require('express');
const router = express.Router();
const {
  addDiamond,
  getDiamonds,
  updateDiamond,
  deleteDiamond
} = require('../controllers/diamondController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addDiamond)
  .get(protect, getDiamonds);

router.route('/:id')
  .put(protect, updateDiamond)
  .delete(protect, deleteDiamond);

module.exports = router;
