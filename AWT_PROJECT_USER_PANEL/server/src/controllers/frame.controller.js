// src/controllers/frame.controller.js
const Frame = require('../models/Frame');
const FrameElement = require('../models/FrameElement');
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  getThumbnailUrl,
  isCloudinaryConfigured
} = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

/* ===========================================================
   GET ALL FRAMES
   =========================================================== */
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

    // Add optimized URLs to frames
    const framesWithUrls = frames.map(frame => ({
      ...frame.toObject(),
      imageUrl: frame.cloudinaryPublicId
        ? frame.cloudinaryUrl
        : `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`,
      thumbnailUrl: frame.cloudinaryPublicId
        ? getThumbnailUrl(frame.cloudinaryPublicId)
        : `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`
    }));

    res.json({
      success: true,
      count: framesWithUrls.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      frames: framesWithUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching frames',
      error: error.message
    });
  }
};

/* ===========================================================
   CREATE FRAME
   =========================================================== */
const createFrame = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Frame image is required' });
    }

    const { name, dimensions } = req.body;

    let cloudinaryResult = null;
    let fileSize = req.file.size;

    // Upload to Cloudinary if configured
    if (isCloudinaryConfigured()) {
      try {
        cloudinaryResult = await uploadToCloudinary(
          req.file.path,
          'tempify/frames',
          { transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }] }
        );
        fileSize = cloudinaryResult.bytes;
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message
        });
      }
    } else {
      // Move file locally
      const targetDir = path.join(__dirname, '../../public/Frame_images');
      const targetPath = path.join(targetDir, req.file.filename);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.renameSync(req.file.path, targetPath);
    }

    const frame = new Frame({
      name: name || `Frame ${Date.now()}`,
      imagePath: cloudinaryResult ? cloudinaryResult.public_id : req.file.filename,
      cloudinaryPublicId: cloudinaryResult ? cloudinaryResult.public_id : null,
      cloudinaryUrl: cloudinaryResult ? cloudinaryResult.secure_url : null,
      fileSize,
      fileFormat: path.extname(req.file.originalname).slice(1).toLowerCase(),
      dimensions: dimensions || { width: 800, height: 600 },
      createdBy: req.user._id
    });

    await frame.save();

    res.status(201).json({
      success: true,
      message: 'Frame created successfully',
      data: {
        ...frame.toObject(),
        imageUrl: frame.cloudinaryUrl || `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`,
        thumbnailUrl: frame.cloudinaryPublicId
          ? getThumbnailUrl(frame.cloudinaryPublicId)
          : `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`
      }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'Error creating frame', error: error.message });
  }
};

/* ===========================================================
   CREATE FRAME WITH ELEMENTS
   =========================================================== */
const createFrameWithElements = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Frame image is required' });
    }

    const { name, dimensions, elements, x, y, font_size, color } = req.body;

    let cloudinaryResult = null;
    let fileSize = req.file.size;

    if (isCloudinaryConfigured()) {
      try {
        cloudinaryResult = await uploadToCloudinary(req.file.path, 'tempify/frames');
        fileSize = cloudinaryResult.bytes;
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message
        });
      }
    } else {
      // Move file locally
      const targetDir = path.join(__dirname, '../../public/Frame_images');
      const targetPath = path.join(targetDir, req.file.filename);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.renameSync(req.file.path, targetPath);
    }

    const frame = new Frame({
      name: name || `Frame ${Date.now()}`,
      imagePath: cloudinaryResult ? cloudinaryResult.public_id : req.file.filename,
      cloudinaryPublicId: cloudinaryResult ? cloudinaryResult.public_id : null,
      cloudinaryUrl: cloudinaryResult ? cloudinaryResult.secure_url : null,
      fileSize,
      fileFormat: path.extname(req.file.originalname).slice(1).toLowerCase(),
      dimensions: dimensions || { width: 800, height: 600 },
      createdBy: req.user._id
    });

    await frame.save();

    // Elements
    let frameElements = [];
    if (elements) {
      const elementsArray = Array.isArray(elements) ? elements : [elements];
      const xArray = Array.isArray(x) ? x : [x];
      const yArray = Array.isArray(y) ? y : [y];
      const fontSizeArray = Array.isArray(font_size) ? font_size : [font_size];
      const colorArray = Array.isArray(color) ? color : [color];

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
    }

    res.status(201).json({
      success: true,
      message: 'Frame and elements created successfully',
      data: {
        frame: {
          ...frame.toObject(),
          imageUrl: frame.cloudinaryUrl || `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`,
          thumbnailUrl: frame.cloudinaryPublicId
            ? getThumbnailUrl(frame.cloudinaryPublicId)
            : `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`
        },
        elements: frameElements
      }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'Error creating frame with elements', error: error.message });
  }
};

/* ===========================================================
   GET FRAME BY ID WITH ELEMENTS
   =========================================================== */
const getFrameById = async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);
    if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });

    const elements = await FrameElement.find({ frameId: req.params.id, isActive: true });

    res.json({
      success: true,
      data: {
        frame: {
          ...frame.toObject(),
          imageUrl: frame.cloudinaryUrl || `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`,
          thumbnailUrl: frame.cloudinaryPublicId
            ? getThumbnailUrl(frame.cloudinaryPublicId)
            : `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`
        },
        elements
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching frame', error: error.message });
  }
};

/* ===========================================================
   GET ALL FRAMES WITH ELEMENTS
   =========================================================== */
const getFramesWithElements = async (req, res) => {
  try {
    const frames = await Frame.find({ isActive: true }).sort({ createdAt: -1 });

    const framesWithElements = [];
    for (const frame of frames) {
      const elements = await FrameElement.find({ frameId: frame._id, isActive: true });
      framesWithElements.push({
        frame: {
          ...frame.toObject(),
          imageUrl: frame.cloudinaryUrl || `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`,
          thumbnailUrl: frame.cloudinaryPublicId
            ? getThumbnailUrl(frame.cloudinaryPublicId)
            : `${req.protocol}://${req.get('host')}/Frame_images/${frame.imagePath}`
        },
        elements
      });
    }

    res.json({ success: true, count: framesWithElements.length, data: framesWithElements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching frames with elements', error: error.message });
  }
};

/* ===========================================================
   UPDATE FRAME
   =========================================================== */
const updateFrame = async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);
    if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });

    const updateData = { ...req.body };

    // If new file uploaded
    if (req.file) {
      // Delete old Cloudinary image or local file
      if (frame.cloudinaryPublicId && isCloudinaryConfigured()) {
        await deleteFromCloudinary(frame.cloudinaryPublicId);
      } else if (frame.imagePath) {
        const oldPath = path.join(__dirname, '../../public/Frame_images', frame.imagePath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Upload new
      let cloudinaryResult = null;
      if (isCloudinaryConfigured()) {
        cloudinaryResult = await uploadToCloudinary(req.file.path, 'tempify/frames');
        updateData.imagePath = cloudinaryResult.public_id;
        updateData.cloudinaryPublicId = cloudinaryResult.public_id;
        updateData.cloudinaryUrl = cloudinaryResult.secure_url;
        updateData.fileSize = cloudinaryResult.bytes;
      } else {
        const targetDir = path.join(__dirname, '../../public/Frame_images');
        const targetPath = path.join(targetDir, req.file.filename);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        fs.renameSync(req.file.path, targetPath);
        updateData.imagePath = req.file.filename;
        updateData.fileSize = req.file.size;
        updateData.cloudinaryPublicId = null;
        updateData.cloudinaryUrl = null;
      }
      updateData.fileFormat = path.extname(req.file.originalname).slice(1).toLowerCase();
    }

    const updatedFrame = await Frame.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Frame updated successfully',
      data: updatedFrame
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'Error updating frame', error: error.message });
  }
};

/* ===========================================================
   DELETE FRAME
   =========================================================== */
const deleteFrame = async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);
    if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });

    // Delete Cloudinary or local file
    if (frame.cloudinaryPublicId && isCloudinaryConfigured()) {
      await deleteFromCloudinary(frame.cloudinaryPublicId);
    } else if (frame.imagePath) {
      const filePath = path.join(__dirname, '../../public/Frame_images', frame.imagePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Delete frame + elements
    await Frame.findByIdAndDelete(req.params.id);
    await FrameElement.deleteMany({ frameId: req.params.id });

    res.json({ success: true, message: 'Frame and associated elements deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting frame', error: error.message });
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
