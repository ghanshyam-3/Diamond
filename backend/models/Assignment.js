const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    diamond: { type: mongoose.Schema.Types.ObjectId, ref: 'Diamond', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price_per_polish: Number,
    status: { type: String, enum: ['assigned', 'completed'], default: 'assigned' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
