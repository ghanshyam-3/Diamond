const Diamond = require('../models/Diamond');

// Generate unique ID
const generateUniqueId = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `D${year}${month}`;
  
  // Get the last diamond with this prefix
  const lastDiamond = await Diamond.findOne(
    { unique_id: new RegExp(`^${prefix}`) },
    {},
    { sort: { unique_id: -1 } }
  );

  let sequence = 1;
  if (lastDiamond) {
    const lastSequence = parseInt(lastDiamond.unique_id.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${prefix}${sequence.toString().padStart(4, '0')}`;
};

// Create new diamond
exports.addDiamond = async (req, res) => {
  try {
    const unique_id = await generateUniqueId();
    const diamondData = {
      unique_id,
      carat: req.body.weight,
      color: req.body.color,
      clarity: req.body.clarity,
      shape: req.body.shape,
      status: req.body.status,
      buying_price: req.body.price,
      qr_code: unique_id // Using unique_id as QR code for now
    };
    const diamond = await Diamond.create(diamondData);
    res.json(diamond);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all diamonds
exports.getDiamonds = async (req, res) => {
  try {
    const diamonds = await Diamond.find();
    res.json(diamonds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update diamond
exports.updateDiamond = async (req, res) => {
  try {
    const diamond = await Diamond.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(diamond);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete diamond
exports.deleteDiamond = async (req, res) => {
  try {
    await Diamond.findByIdAndDelete(req.params.id);
    res.json({ message: 'Diamond removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
