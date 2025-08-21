const QRCode = require('qrcode');
const Diamond = require('../models/Diamond');
const path = require('path');
const fs = require('fs');

exports.generateDiamondQR = async (req, res) => {
  try {
    const diamondId = req.params.id;
    const diamond = await Diamond.findById(diamondId);

    if (!diamond) return res.status(404).json({ message: 'Diamond not found' });

    // Text or URL to embed into QR
    const textToQR = `Diamond-${diamond.unique_id}`;

    const qrImagePath = path.join(__dirname, `../qr/diamond_${diamond.unique_id}.png`);

    // generate and save
    await QRCode.toFile(qrImagePath, textToQR);

    // Save path in DB
    diamond.qr_code = `/qr/diamond_${diamond.unique_id}.png`;
    await diamond.save();

    res.json({ message: 'QR code generated', qrPath: diamond.qr_code });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
