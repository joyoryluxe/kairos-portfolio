// routes/uploadRoutes.js  – File upload via multer → Cloudinary
const express  = require('express');
const multer   = require('multer');
const cloudinary = require('../config/cloudinary');
const router   = express.Router();

// Store file in memory (no disk write), then stream to Cloudinary
const storage  = multer.memoryStorage();
const upload   = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed (jpg, png, webp, gif, avif)'), false);
  },
});

/**
 * POST /api/upload
 * Body: multipart/form-data  { file: <image>, folder?: string }
 * Returns: { success, url, publicId }
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const folder = req.body.folder || 'kairos';

    // Upload buffer to Cloudinary via stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      success: true,
      url:      result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/upload
 * Body: { publicId: "kairos/abc123" }
 * Removes an image from Cloudinary
 */
router.delete('/', async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ success: false, message: 'publicId is required' });
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
