const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const Template = require('../models/Template');
const Category = require('../models/Category');

// Configure multer to use a temp directory; ensure it exists
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/temp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  }
});

const upload = multer({ 
  storage,
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ✅ Upload template
router.post('/upload', upload.single('templateImage'), async (req, res) => {
  try {
    const { category } = req.body;
    const file = req.file;

    console.log('Template upload request:', { category, file: file?.filename });

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }

    // Verify that the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, error: 'Category not found' });
    }

    let cloudinaryResult = null;
    if (!isCloudinaryConfigured()) {
      return res.status(500).json({ success: false, error: 'Cloudinary is not configured on the server' });
    }

    try {
      cloudinaryResult = await uploadToCloudinary(file.path, 'tempify/templates', {
        transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }]
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Image upload failed', details: err.message });
    }

    // Create new template with Cloudinary details
    const newTemplate = new Template({
      name: file.originalname,
      cloudinaryPublicId: cloudinaryResult.public_id,
      cloudinaryUrl: cloudinaryResult.secure_url,
      // keep legacy fields
      path: cloudinaryResult.public_id,
      // align with user server schema expectations
      imagePath: cloudinaryResult.public_id,
      category_id: category
    });

    const savedTemplate = await newTemplate.save();
    console.log('Template saved successfully:', savedTemplate);

    res.json({ 
      success: true, 
      message: 'Template uploaded successfully',
      template: savedTemplate
    });

  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ success: false, error: 'Upload failed', details: error.message });
  }
});

// ✅ Get all templates
router.get('/all', async (req, res) => {
  try {
    const templates = await Template.find().populate('category_id');
    res.json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch templates' });
  }
});

// ✅ Get templates by category
router.get('/by-category/:categoryId', async (req, res) => {
  try {
    const templates = await Template.find({ category_id: req.params.categoryId }).populate('category_id');
    res.json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching templates by category:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch templates' });
  }
});

module.exports = router;
