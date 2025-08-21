const mongoose = require('mongoose');

const diamondSchema = new mongoose.Schema(
  {
    unique_id: { type: String, required: true, unique: true }, // like barcode/serial
    carat: Number,
    qr_code: String,
    color: String,
    clarity: String,
    shape: String,
    status: {
      type: String,
      enum: ['in_stock', 'approved_for_polish', 'assigned', 'polished', 'sold'],
      default: 'in_stock'
    },
    buying_price: Number,
    selling_price: Number
  },
  
  { timestamps: true }
  
);

module.exports = mongoose.model('Diamond', diamondSchema);
