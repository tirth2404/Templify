const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Frame = require('../models/Frame');
const FrameElement = require('../models/FrameElement');

// Configure multer for frame uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/Frame_images');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// ✅ Upload frame only
router.post('/upload', upload.single('frameImage'), async (req, res) => {
  try {
    const file = req.file;

    console.log('Frame upload request:', { file: file?.filename });

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Create new frame
    const newFrame = new Frame({
      img: file.filename
    });

    const savedFrame = await newFrame.save();
    console.log('Frame saved successfully:', savedFrame);

    res.json({ 
      success: true, 
      message: 'Frame uploaded successfully',
      frame: savedFrame
    });

  } catch (error) {
    console.error('Error uploading frame:', error);
    res.status(500).json({ success: false, error: 'Upload failed', details: error.message });
  }
});

// ✅ Upload frame with elements
router.post('/upload-with-elements', upload.single('frameImage'), async (req, res) => {
  try {
    const file = req.file;
    const { elements, x, y, font_size, color } = req.body;

    console.log('Frame with elements upload request:', { 
      file: file?.filename, 
      elements: elements,
      x: x,
      y: y,
      font_size: font_size,
      color: color
    });

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Convert single values to arrays if needed
    const elementsArray = Array.isArray(elements) ? elements : [elements];
    const xArray = Array.isArray(x) ? x : [x];
    const yArray = Array.isArray(y) ? y : [y];
    const fontSizeArray = Array.isArray(font_size) ? font_size : [font_size];
    const colorArray = Array.isArray(color) ? color : [color];

    if (!elementsArray || elementsArray.length === 0) {
      return res.status(400).json({ success: false, error: 'No elements data provided' });
    }

    // Create new frame
    const newFrame = new Frame({
      img: file.filename
    });

    const savedFrame = await newFrame.save();
    console.log('Frame saved successfully:', savedFrame);

    // Create frame elements
    const frameElements = [];
    for (let i = 0; i < elementsArray.length; i++) {
      const element = elementsArray[i];
      const posX = parseInt(xArray[i]);
      const posY = parseInt(yArray[i]);
      const fontSize = element === 'logo' ? 0 : parseInt(fontSizeArray[i] || 0);
      const fontColor = element === 'logo' ? '#000000' : (colorArray[i] || '#000000');

      const newElement = new FrameElement({
        frame_id: savedFrame._id,
        element_type: element,
        pos_x: posX,
        pos_y: posY,
        font_size: fontSize,
        font_color: fontColor
      });

      const savedElement = await newElement.save();
      frameElements.push(savedElement);
    }

    console.log('Frame elements saved successfully:', frameElements.length);

    res.json({ 
      success: true, 
      message: 'Frame and elements uploaded successfully',
      frame: savedFrame,
      elements: frameElements
    });

  } catch (error) {
    console.error('Error uploading frame with elements:', error);
    res.status(500).json({ success: false, error: 'Upload failed', details: error.message });
  }
});

// ✅ Get all frames
router.get('/all', async (req, res) => {
  try {
    const frames = await Frame.find().sort({ uploaded_at: -1 });
    res.json({ success: true, frames });
  } catch (error) {
    console.error('Error fetching frames:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch frames' });
  }
});

// ✅ Get frame with elements
router.get('/with-elements/:frameId', async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.frameId);
    if (!frame) {
      return res.status(404).json({ success: false, error: 'Frame not found' });
    }

    const elements = await FrameElement.find({ frame_id: req.params.frameId });
    
    res.json({ 
      success: true, 
      frame: frame,
      elements: elements
    });
  } catch (error) {
    console.error('Error fetching frame with elements:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch frame' });
  }
});

// ✅ Get all frames with their elements
router.get('/all-with-elements', async (req, res) => {
  try {
    const frames = await Frame.find().sort({ uploaded_at: -1 });
    const framesWithElements = [];

    for (const frame of frames) {
      const elements = await FrameElement.find({ frame_id: frame._id });
      framesWithElements.push({
        frame: frame,
        elements: elements
      });
    }

    res.json({ success: true, frames: framesWithElements });
  } catch (error) {
    console.error('Error fetching frames with elements:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch frames' });
  }
});

module.exports = router;
