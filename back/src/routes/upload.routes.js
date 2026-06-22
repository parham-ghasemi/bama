const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/villas/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload multiple images
router.post('/multiple', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'هیچ فایلی آپلود نشد' });
  }

  const urls = req.files.map(file => `/uploads/villas/${file.filename}`);

  res.json({ success: true, urls });
});

module.exports = router;