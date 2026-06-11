import express from 'express';
const router = express.Router();
import upload from '../middleware/upload.js';

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the file path
    res.json({
      message: 'Image uploaded successfully',
      imagePath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
