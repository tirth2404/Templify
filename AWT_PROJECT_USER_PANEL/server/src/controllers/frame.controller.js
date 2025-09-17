const Frame = require('../models/Frame');
const FrameElement = require('../models/FrameElement');
const fs = require('fs');
const path = require('path');

// @desc    Get all frames
// @route   GET /api/frames
// @access  Public
const getFrames = async (req, res) => {
  try {
    const { page = 1, limit = 12, search } = req.query;
    
    const query = { isActive: true };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const frames = await Frame.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Frame.countDocuments(query);

    res.json({
      success: true,
      count: frames.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      frames
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching frames',
      error: error.message
    });
  }
};

// @desc    Create frame
// @route   POST /api/frames
// @access  Private (Admin)
const createFrame = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Frame image is required'
      });
    }

    const { name, dimensions } = req.body;
    
    // Get file info
    const stats = fs.statSync(req.file.path);
    
    const frame = new Frame({
      name: name || `Frame ${Date.now()}`,
      imagePath: req.file.filename,
      fileSize: stats.size,
      fileFormat: path.extname(req.file.originalname).slice(1).toLowerCase(),
      dimensions: dimensions || { width: 800, height: 600 },
      createdBy: req.user._id
    });

    await frame.save();

    res.status(201).json({
      success: true,
      message: 'Frame created successfully',
      data: frame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating frame',
      error: error.message
    });
  }
};

// @desc    Create frame with elements
// @route   POST /api/frames/with-elements
// @access  Private (Admin)
const createFrameWithElements = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Frame image is required'
      });
    }

    const { name, dimensions, elements, x, y, font_size, color } = req.body;
    
    // Get file info
    const stats = fs.statSync(req.file.path);
    
    // Create frame
    const frame = new Frame({
      name: name || `Frame ${Date.now()}`,
      imagePath: req.file.filename,
      fileSize: stats.size,
      fileFormat: path.extname(req.file.originalname).slice(1).toLowerCase(),
      dimensions: dimensions || { width: 800, height: 600 },
      createdBy: req.user._id
    });

    await frame.save();

    // Create frame elements if provided
    if (elements) {
      const elementsArray = Array.isArray(elements) ? elements : [elements];
      const xArray = Array.isArray(x) ? x : [x];
      const yArray = Array.isArray(y) ? y : [y];
      const fontSizeArray = Array.isArray(font_size) ? font_size : [font_size];
      const colorArray = Array.isArray(color) ? color : [color];

      const frameElements = [];
      for (let i = 0; i < elementsArray.length; i++) {
        if (elementsArray[i] && xArray[i] !== undefined && yArray[i] !== undefined) {
          const element = new FrameElement({
            frameId: frame._id,
            elementType: elementsArray[i],
            position: {
              x: parseInt(xArray[i]),
              y: parseInt(yArray[i])
            },
            styling: {
              fontSize: elementsArray[i] === 'logo' ? 0 : parseInt(fontSizeArray[i] || 16),
              fontColor: elementsArray[i] === 'logo' ? '#000000' : (colorArray[i] || '#000000')
            }
          });

          await element.save();
          frameElements.push(element);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Frame and elements created successfully',
        data: {
          frame,
          elements: frameElements
        }
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Frame created successfully',
        data: { frame }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating frame with elements',
      error: error.message
    });
  }
};

// @desc    Get frame by ID with elements
// @route   GET /api/frames/:id
// @access  Public
const getFrameById = async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);
    
    if (!frame) {
      return res.status(404).json({
        success: false,
        message: 'Frame not found'
      });
    }

    const elements = await FrameElement.find({ 
      frameId: req.params.id, 
      isActive: true 
    });

    res.json({
      success: true,
      data: {
        frame,
        elements
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching frame',
      error: error.message
    });
  }
};

// @desc    Get all frames with elements
// @route   GET /api/frames/all-with-elements
// @access  Public
const getFramesWithElements = async (req, res) => {
  try {
    const frames = await Frame.find({ isActive: true })
      .sort({ createdAt: -1 });

    const framesWithElements = [];
    
    for (const frame of frames) {
      const elements = await FrameElement.find({ 
        frameId: frame._id, 
        isActive: true 
      });
      
      framesWithElements.push({
        frame,
        elements
      });
    }

    res.json({
      success: true,
      count: framesWithElements.length,
      data: framesWithElements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching frames with elements',
      error: error.message
    });
  }
};

// @desc    Update frame
// @route   PUT /api/frames/:id
// @access  Private (Admin)
const updateFrame = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      // Delete old file
      const existingFrame = await Frame.findById(req.params.id);
      if (existingFrame && existingFrame.imagePath) {
        const oldFilePath = path.join(__dirname, '../../public/Frame_images', existingFrame.imagePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Update with new file info
      const stats = fs.statSync(req.file.path);
      updateData.imagePath = req.file.filename;
      updateData.fileSize = stats.size;
      updateData.fileFormat = path.extname(req.file.originalname).slice(1).toLowerCase();
    }

    const frame = await Frame.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!frame) {
      return res.status(404).json({
        success: false,
        message: 'Frame not found'
      });
    }

    res.json({
      success: true,
      message: 'Frame updated successfully',
      data: frame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating frame',
      error: error.message
    });
  }
};

// @desc    Delete frame
// @route   DELETE /api/frames/:id
// @access  Private (Admin)
const deleteFrame = async (req, res) => {
  try {
    const frame = await Frame.findByIdAndDelete(req.params.id);

    if (!frame) {
      return res.status(404).json({
        success: false,
        message: 'Frame not found'
      });
    }

    // Delete associated file
    if (frame.imagePath) {
      const filePath = path.join(__dirname, '../../public/Frame_images', frame.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete associated frame elements
    await FrameElement.deleteMany({ frameId: req.params.id });

    res.json({
      success: true,
      message: 'Frame and associated elements deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting frame',
      error: error.message
    });
  }
};

module.exports = {
  getFrames,
  createFrame,
  createFrameWithElements,
  getFrameById,
  getFramesWithElements,
  updateFrame,
  deleteFrame
};

// =====================================================